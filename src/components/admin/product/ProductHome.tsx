import React from 'react'
import GetAllProduct from './productList/GetAllProduct'
import ProductTable from './productList/ProductTable'
import GetAllAttribute from '../attribute/attributeList/GetAllAttribute'
import GetAllcategory from '../category/listCategory/GetAllcategory'
import GetAllBrand from '../brand/brandList/GetAllBrand'
import GetAllSegment from '../segment/segmentList/GetAllSegment'

const ProductHome = () => {
  return (
  <>
  <ProductTable/>
  <GetAllProduct/>
 
   <GetAllAttribute/>
  <GetAllcategory/>
   <GetAllBrand />


  </>
  )
}

export default ProductHome