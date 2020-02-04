export default interface IApplication {
    readonly app: Express.Application;
    init();
    setup();
}
