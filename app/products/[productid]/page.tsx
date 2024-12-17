"use client"
import { useParams } from "next/navigation"

export default function ProductDetaiPage(){
    const { productid } = useParams()
    return <h1>Products Detail Page {productid}</h1>
}