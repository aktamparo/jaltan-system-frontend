export interface UomType {
    id?:string;
  type:string;
  standardUoMId ?:string;
}

export interface Uom{
    id?:string;
    name:string;
    symbol:string;
    conversionFactor:number;
    uomTypeId:string;
}