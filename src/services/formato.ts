// Formateador de precios en pesos chilenos, centralizado acá para no repetir
// "new Intl.NumberFormat(...)" en cada componente que muestra un precio.
export const formatoCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
});
