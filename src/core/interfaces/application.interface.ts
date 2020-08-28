export default interface ApplicationInterface {
    init(): Promise<any>;
    listen(port: number);
}
