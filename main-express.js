const Express=require('express');
const PdfGenerator=require('./src/index');

const app=new Express();
const port=4488 || process.env.port;



app.get('/',async (req,res)=>{
    const invoiceTo='Martin Chuka';

    const pdf=new PdfGenerator(invoiceTo+"'s Invoice");
    pdf.logo=`https://www.electrosoft.tech/assets/img/logo/app-logo1.png`;
    pdf.addClient(invoiceTo,'Ikoyi Eti-Osa LGA','Ikoyi Lagos',101233);
    pdf.taxPercentage=10;
    pdf.addItem('SanDisk MMC',20,2);
    pdf.addItem('Funko Wobbler Star Wars...',60,1);
    let generated=await pdf.generatePdfInvoice();
    res.send(generated);
});


app.listen(port,'127.0.01',()=>{
    console.log(`listening on port ${port}`)
})