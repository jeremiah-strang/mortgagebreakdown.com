'use strict'

const convertAprToMonthly = (apr) => {
  return Math.pow(1 + apr, 1 / 12) - 1
}

exports.round = (num, numDecimals) => {
  const factor = typeof numDecimals === 'number' ? Math.pow(10, numDecimals) : 1
  return Math.round(num * factor) / factor
}

exports.commaFormat = (num, fixDecimals) => {
  if (fixDecimals > 0) {
    return num.toFixed(fixDecimals).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  if (fixDecimals === 0) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

exports.calcMortgageBreakdown = (amt, apr, yrs, hoa, taxes, mortgageIns, homeownersIns, appreciation, extraPrincipal) => {
  amt = typeof amt === 'string' ? parseFloat(amt) : amt
  apr = typeof apr === 'string' ? parseFloat(apr) : apr
  yrs = typeof yrs === 'string' ? parseFloat(yrs) : yrs
  hoa = typeof hoa === 'string' ? parseFloat(hoa) : hoa
  taxes = typeof taxes === 'string' ? parseFloat(taxes) : taxes
  mortgageIns = typeof mortgageIns === 'string' ? parseFloat(mortgageIns) : mortgageIns
  homeownersIns = typeof homeownersIns === 'string' ? parseFloat(homeownersIns) : homeownersIns
  appreciation = typeof appreciation === 'string' ? parseFloat(appreciation) : appreciation
  extraPrincipal = typeof extraPrincipal === 'string' ? parseFloat(extraPrincipal) : extraPrincipal

  amt = isNaN(amt) ? 0 : amt
  apr = isNaN(apr) ? 0 : apr
  yrs = isNaN(yrs) ? 0 : yrs
  hoa = isNaN(hoa) ? 0 : hoa
  taxes = isNaN(taxes) ? 0 : taxes
  mortgageIns = isNaN(mortgageIns) ? 0 : mortgageIns
  homeownersIns = isNaN(homeownersIns) ? 0 : homeownersIns
  appreciation = isNaN(appreciation) ? 0 : appreciation
  extraPrincipal = isNaN(extraPrincipal) ? 0 : extraPrincipal

  let rm = convertAprToMonthly(apr)
  let n = yrs * 12
  let pmt = amt * (rm * Math.pow((1 + rm), n)) / (Math.pow((1 + rm), n) - 1)
  let monthTot = pmt + hoa + taxes / 12 + mortgageIns + homeownersIns + extraPrincipal

  let mo = 0
  let principal = amt
  let equity = 0

  let rows = new Array(n)

  do {
    let interest = (1 + rm) * principal - principal
    let equityGained = pmt - interest + extraPrincipal
    let totExp = monthTot
    principal -= equityGained
    if (principal < 0) {
      equity += equityGained + principal
      equityGained += principal
      principal = 0
    } else {
      equity += equityGained
    }

    let row = {
      yr: Math.floor(mo / 12) + 1,
      mo: mo % 12 + 1,
      owe: exports.commaFormat(principal, 0),
      equ: exports.commaFormat(equity, 0),
      pmt: exports.commaFormat(pmt, 0),
      toInt: exports.commaFormat(interest, 0),
      toEqu: exports.commaFormat(equityGained, 0),
      totExp: exports.commaFormat(totExp, 0),
    }

    rows[mo] = row
    mo++
  } while (mo < n)

  return rows
}
