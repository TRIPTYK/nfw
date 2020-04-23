export default interface ApplicationInterface {
    readonly App: Express.Application
    init()
    setup()
}
