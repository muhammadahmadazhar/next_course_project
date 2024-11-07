export default function ReviewDetaiPage({params}: {params: {productid: string, reviewid: string}}){
    return <h1>Review {params.reviewid} for Product {params.productid}</h1>
}