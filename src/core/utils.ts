export const formatMoney = (number: number) => `R$ ${new Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number*.01)}`;