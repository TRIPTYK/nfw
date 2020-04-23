export default interface IApplication {
    readonly App: Express.Application
    init()
    setup()
}
