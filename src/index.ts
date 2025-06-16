import dotenv from "dotenv";
import express, { Request, Response } from "express";
// import { routers } from './apps/routes/users.route';

import colorrouter from "./apps/routers/colors_router";
import supplierrouter from "./apps/routers/suppliers_router";
import categoryrouter from "./apps/routers/categories_router";
import productrouter from "./apps/routers/products_router";
import warehouserouter from "./apps/routers/warehouses_router";
import importreceiptrouter from "./apps/routers/import_receipts_router";
import userrouter from "./apps/routers/users_router";
import paymentrouter from "./apps/routers/payment_router";
import orderdetailrouter from "./apps/routers/order_details_router";
import reviewrouter from "./apps/routers/reviews_router";
import orderrouter from "./apps/routers/orders_router";

dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const port = 4000;

// to prevent miss
app.use(cors());
// to create and assign cookies
app.use(cookieParser());
// transfer Request and Response to json
app.use(express.json());

app.use(express.json());
// routers(app);

app.use("/api", colorrouter);
app.use("/api", supplierrouter);
app.use("/api", categoryrouter);
app.use("/api", productrouter);
app.use("/api", warehouserouter);
app.use("/api", importreceiptrouter);
app.use("/api", userrouter);
app.use("/api", reviewrouter);
app.use("/api", paymentrouter);
app.use("/api", orderdetailrouter);
app.use("/api", orderrouter);


app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Backend is available");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// JSON WEB TOKEN