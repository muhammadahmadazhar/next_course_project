export default function ProductDetaiPage({params}: {params: {productid: string}}){
    return <h1>Products Detail Page {params.productid}</h1>
}