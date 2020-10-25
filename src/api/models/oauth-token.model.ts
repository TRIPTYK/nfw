import {AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, Unique} from "typeorm";
import {User} from "./user.model";
import { OAuthTypes } from "../enums/oauth-type.enum";
import { JsonApiModel } from "../../core/models/json-api.model";
import { randomBytes, createCipheriv, createDecipheriv } from "crypto";
import ConfigurationService from "../../core/services/configuration.service";
import { container } from "tsyringe";

@Entity()
@Unique(["user", "type"])
export class OAuthToken extends JsonApiModel<OAuthToken> {
    @Column({
        nullable : false,
        type : "text"
    })
    public refreshToken: string;

    @ManyToOne(() => User, {
        eager: true,
        nullable: false,
        onDelete: "CASCADE" // Remove refresh-token when user is deleted
    })
    @JoinColumn()
    public user: User;

    @Column({
        nullable : false,
        type : "text"
    })
    public accessToken: string;

    @Column({
        enum: OAuthTypes,
        nullable : false,
        type: "enum"
    })
    public type: OAuthTypes;

    @BeforeInsert()
    @BeforeUpdate()
    public async encryptRefresh() {
        const configurationService = container.resolve<ConfigurationService>(ConfigurationService);
        const iv = randomBytes(16);
        const cipher = createCipheriv("aes-256-cbc", Buffer.from(configurationService.config.oAuthKey), iv);

        const encrypted = Buffer.concat([cipher.update(this.refreshToken), cipher.final()]); 
        const encryptedString = `${iv.toString('hex')}:${encrypted.toString('hex')}`;
        this.refreshToken = encryptedString;
    }

    @AfterLoad()
    public decryptRefresh() {
        const configurationService = container.resolve<ConfigurationService>(ConfigurationService);
        const textParts = this.refreshToken.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = createDecipheriv('aes-256-cbc', Buffer.from(configurationService.config.oAuthKey), iv);
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);
        this.refreshToken = decrypted.toString();
    }
}
