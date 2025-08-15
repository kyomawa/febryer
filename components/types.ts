export type Group = 'Extérieur' | 'Intérieur' | 'Options'
export type SizeId = 'city'|'berline'|'suv'|'van'
export type PackId = 'essentiel'|'confort'|'pro'
export type Service = { id: string; name: string; price: number; group: Group }
export type Quote = {
  pack: PackId; size: SizeId;
  items:{id:string;name:string;price:number}[]; subtotal:number; multiplier:number; total:number
}
