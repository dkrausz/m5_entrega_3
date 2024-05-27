import "reflect-metadata";
import "express-async-errors";
import  express ,{json} from "express";
import helmet from "helmet";
import { carRoute } from "./routes/car.routes";
import { handleErrors } from "./middlewares/handleErrorsMiddleware";
import { userRoute } from "./routes/user.routes";

export const app = express();

app.use(helmet());
app.use(json());

app.use("/cars",carRoute);
app.use("/users",userRoute);

app.use(handleErrors);

