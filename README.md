This is the drawingboard-micro-websocket-nodejs example based only on Node.js+Express+SocketIO
Together with drawingboard-micro-sse it delivers the functionality of 
drawingboard-light as a set of microservices that can be redeployed separately

environment variable SSE_LOCATION points to the deployment url 
of drawingboard-micro-sse and can be edited in accs/deployment.json

to run: "node main.js" 

to deploy to ACCS:
    go in the accs directory
    edit the variables for credentials and identity domain in rest.sh
    run rest.sh e.g. as "bash -x rest.sh create"


