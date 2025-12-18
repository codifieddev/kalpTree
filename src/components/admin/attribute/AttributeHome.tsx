import React from 'react'
import GetAllAttribute from './attributeList/GetAllAttribute'
import AttributeTable from './attributeList/AttributeTable'
import GetAllcategory from '../category/listCategory/GetAllcategory'

const AttributeHome = () => {
  return (
  <>
  <AttributeTable/>
  <GetAllAttribute/>
  <GetAllcategory/>
  </>
  )
}

export default AttributeHome