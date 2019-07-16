const Koa=require('koa');
const Router=require('koa-router');
const PdfGenerator=require('./src/index');



const app=new Koa();
const router=new Router();
const port=4488 || process.env.port;


router.get('/',async (ctx,next)=>{
    const invoiceTo='Martin Chuka';

    const pdf=new PdfGenerator(invoiceTo+"'s Invoice");
    pdf.logo=`https://www.electrosoft.tech/assets/img/logo/app-logo1.png`;
    pdf.addClient(invoiceTo,'Ikoyi Eti-Osa LGA','Ikoyi Lagos',101233);
    pdf.taxPercentage=10;
    pdf.addItem('SanDisk MMC',20,2);
    pdf.addItem('Funko Wobbler Star Wars...',60,1);
    ctx.body=await pdf.generatePdfInvoice();
});

app.use(router.routes()).use(router.allowedMethods());


app.listen(port,'127.0.01',()=>{
    console.log(`listening on port ${port}`)
})