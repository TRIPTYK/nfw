class ServiceContainer {
    public static registerService(name: string, instance: InstanceType<any>): InstanceType<any> {
        return ServiceContainer.services[name] = instance;
    }

    public static getService(name: string): InstanceType<any> {
        if (ServiceContainer.services[name] === undefined) {
            throw new Error("Service not found");
        }
        return ServiceContainer.services[name];
    }

    private static services: object = {};
}

export {
    ServiceContainer
};
