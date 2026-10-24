# OpenAPI — B2B Commerce (v1)
- GET /health
- GET|POST /vendors — {name,contact?,phone?,email?,terms?}
- GET|POST /products — {sku,name,unitPriceCents,quantityOnHand?}
- GET|POST /purchase-orders — {vendorId,items:[{sku,qty,unitPriceCents}],expectedAt?}
- POST /purchase-orders/:id/approve
- POST /webhooks/mpesa
