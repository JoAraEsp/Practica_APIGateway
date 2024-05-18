import express, { Application, Request } from "express";
import morgan from "morgan";
import dotenv from 'dotenv';
import { Signale } from "signale";
import proxy from "express-http-proxy";

const app: Application = express();
const signale = new Signale();

dotenv.config();

app.use(morgan('dev'));
const PORT = process.env.PORT || 3000;
const GATEWAY = "api-gateway";

app.use('/api/v1/orders/create', proxy('http://localhost:3001/orders/create', {
    proxyReqPathResolver: function (req: Request) {
        return '/orders/create';
    }
}));
app.use('/api/v1/orders/list', proxy('http://localhost:3001/orders', {
    proxyReqPathResolver: function (req: Request) {
        return '/orders';
    }
}));
app.use('/api/v1/orders/:id', proxy('http://localhost:3001/orders', {
    proxyReqPathResolver: function (req: Request) {
        return `/orders/${req.params.id}`;
    }
}));

app.use('/api/v1/orders/update-tracking/:id', proxy('http://localhost:3001/orders/update-tracking', {
    proxyReqPathResolver: function (req: Request) {
        return `/orders/update-tracking/${req.params.id}`;
    }
}));

app.use('/api/v1/orders-products/create', proxy('http://localhost:3001/orders-products/create', {
    proxyReqPathResolver: function (req: Request) {
        return '/orders-products/create';
    }
}));
app.use('/api/v1/orders-products/update/:id', proxy('http://localhost:3001/orders-products/update', {
    proxyReqPathResolver: function (req: Request) {
        return `/orders-products/update/${req.params.id}`;
    }
}));

app.use('/api/v1/products/create', proxy('http://localhost:3002/products/create', {
    proxyReqPathResolver: function (req: Request) {
        return '/products/create';
    }
}));
app.use('/api/v1/products/delete/:id', proxy('http://localhost:3002/products/delete', {
    proxyReqPathResolver: function (req: Request) {
        return `/products/delete/${req.params.id}`;
    }
}));
app.use('/api/v1/products/list', proxy('http://localhost:3002/products', {
    proxyReqPathResolver: function (req: Request) {
        return '/products';
    }
}));

app.listen(PORT, () => {
    signale.success(`Servicio de ${GATEWAY} corriendo en http://localhost:${PORT}`);
});
