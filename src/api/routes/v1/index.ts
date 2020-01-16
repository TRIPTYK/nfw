import {Request, Response, Application , Router} from "express";
import DocumentRouter from "./document.route";
import UserRouter from "./user.route";
import AuthRouter from "./auth.route";

export interface IRouter {
    setup(): Router;
}

export default class IndexRouter {
    private registeredRouters: IRouter[] = [];
    private router: Router;

    constructor() {
        this.router = Router();
    }

    public setup() {
        this.router.get("/status", (req: Request, res: Response) => {
            res.sendStatus(200);
        });

        this.register("/documents/", DocumentRouter);
        this.register("/users/", UserRouter);
        this.register("/auth/", AuthRouter);

        return this.router;
    }

    private register(route: string,type, ...args) {
        const newRouter: IRouter = new type(args);
        this.registeredRouters.push(newRouter);
        this.router.use(route, newRouter.setup());
    }
}
