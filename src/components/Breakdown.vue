<template>
  <div class="breakdown">

    <div class="bd-inputs">
      <div class="bd-input-grp-wrap">
        <div class="bd-input-grp">
          <div class="bd-input-wrap">
            <label>Loan Amount<span>$</span></label>
            <input v-model="loanAmount" v-on:keyup.enter="onCalculate"
                   v-on:focus="$event.target.select()" tabindex="1" type="number" />
          </div>
          <div class="bd-input-wrap">
            <label>Interest Rate</label>
            <input v-model="loanAprStr" v-on:keyup.enter="onCalculate"
                   v-on:focus="$event.target.select()" tabindex="2" type="text" />
            <select v-model="rateType">
              <option value="apr" selected>% APR</option>
            </select>
          </div>
          <div class="bd-input-wrap">
            <label>Loan Term</label>
            <input v-model="loanTermYrs" v-on:keyup.enter="onCalculate"
                   v-on:focus="$event.target.select()" tabindex="3" type="number" />
            <span>years</span>
          </div>
          <div class="bd-input-wrap">
            <label>Property Taxes<span>$</span></label>
            <input v-model="taxesPerYr" v-on:keyup.enter="onCalculate"
                   v-on:focus="$event.target.select()" tabindex="5" type="number" />
            <span>per year</span>
          </div>
        </div>

        <div class="bd-input-grp">
          <div class="bd-input-wrap">
            <label>Homeowner's Insurance<span>$</span></label>
            <input v-model="homeownersInsPerMo" v-on:keyup.enter="onCalculate"
                   v-on:focus="$event.target.select()" tabindex="6" type="number" />
            <span>per month</span>
          </div>
          <div class="bd-input-wrap">
            <label>Mortgage Insurance<span>$</span></label>
            <input v-model="mortgageInsPerMo" v-on:keyup.enter="onCalculate"
                   v-on:focus="$event.target.select()" tabindex="6" type="number" />
            <span>per month</span>
          </div>
          <div class="bd-input-wrap">
            <label>HOA Fees<span>$</span></label>
            <input v-model="hoaPerMo" v-on:keyup.enter="onCalculate"
                   v-on:focus="$event.target.select()" tabindex="4" type="number" />
            <span>per month</span>
          </div>
        </div>
      </div>
      <div class="line"></div>
    </div>

    <div class="bd-results">
      <div class="bd-results-hdr-wrap">
        <h3 class="float-left">Results</h3>
        <button v-on:click="onCalculate" tabindex="7" class="btn btn-primary float-right">Calculate</button>
        <button v-on:click="onExportCsv" v-if="results.length > 0"
                class="btn btn-default float-right">Export to CSV</button>
      </div>
      <div v-if="results.length === 0" class="pnl pad1 w100 text-center">
        <h4>Click "Calculate" to see your mortgage breakdown</h4>
      </div>
      <div v-if="results.length > 0" class="bd-results-grid-wrap">
        <data-grid :columns="columns" :data="results"></data-grid>
      </div>
    </div>

  </div>
</template>

<script>
  import DataGrid from './DataGrid'
  import calc from '../logic/mortgageCalc'
  import browserStorage from '../logic/browserStorage'

  export default {
    name: 'breakdown',
    data () {
      return {
        localStorageAvailable: false,
        rateType: 'apr',
        loanAmount: 300000,
        loanApr: 3.75,
        loanAprStr: '3.75',
        loanTermYrs: 30,
        hoaPerMo: 150,
        taxesPerYr: 3000,
        mortgageInsPerMo: 0,
        homeownersInsPerMo: 200,
        appreciation: 0,
        appreciationStr: '0',
        columns: [
          { title: 'Year', key: 'yr', rowClass: '', columnClass: '', },
          { title: 'Month', key: 'mo', rowClass: '', columnClass: '', },
          { title: 'Mortgage Payment', key: 'pmt', rowClass: 'usd', columnClass: '', },
          { title: 'Towards Interest', key: 'toInt', rowClass: 'usd', columnClass: '', },
          { title: 'Total Owed', key: 'owe', rowClass: 'usd', columnClass: '', },
          { title: 'Towards Equity', key: 'toEqu', rowClass: 'usd', columnClass: '', },
          { title: 'Total Equity', key: 'equ', rowClass: 'usd', columnClass: '', },
          { title: 'Cash Due', key: 'totExp', rowClass: 'usd', columnClass: '', },
        ],
        results: [],
      }
    },
    watch: {
      loanAmount: function (loanAmount) {
        this.loanAmount = Math.max(loanAmount, 0)
      },
      loanAprStr: function (loanAprStr) {
        this.loanApr = parseFloat(loanAprStr)
        this.loanApr = !isNaN(this.loanApr) ? Math.max(this.loanApr, 0) : 0
        if (loanAprStr.length > 0 &&
          loanAprStr.substring(loanAprStr.length - 1, loanAprStr.length) === '.') {
          this.loanAprStr = this.loanApr.toString() + '.'
        } else {
          this.loanAprStr = this.loanApr.toString()
        }
      },
      loanTermYrs: function (loanTermYrs) {
        this.loanTermYrs = Math.max(loanTermYrs, 0)
      },
      hoaPerMo: function (hoaPerMo) {
        this.hoaPerMo = Math.max(hoaPerMo, 0)
      },
      taxesPerYr: function (taxesPerYr) {
        this.taxesPerYr = Math.max(taxesPerYr, 0)
      },
      mortgageInsPerMo: function (mortgageInsPerMo) {
        this.mortgageInsPerMo = Math.max(mortgageInsPerMo, 0)
      },
      homeownersInsPerMo: function (homeownersInsPerMo) {
        this.homeownersInsPerMo = Math.max(homeownersInsPerMo, 0)
      },
      appreciationStr: function (appreciationStr) {
        this.appreciation = parseFloat(appreciationStr)
        this.appreciation = !isNaN(this.appreciation) ? Math.max(this.appreciation, 0) : 0
        if (appreciationStr.length > 0 &&
          appreciationStr.substring(appreciationStr.length - 1, appreciationStr.length) === '.') {
          this.appreciationStr = this.appreciation.toString() + '.'
        } else {
          this.appreciationStr = this.appreciation.toString()
        }
      },
    },
    created: function () {
      this.localStorageAvailable = browserStorage.checkIfStorageAvailable('localStorage')
      if (this.localStorageAvailable) {
        this.rateType = localStorage.getItem('rateType', this.rateType) || this.rateType
        this.loanAmount = localStorage.getItem('loanAmount', this.loanAmount) || this.loanAmount
        this.loanApr = localStorage.getItem('loanApr', this.loanApr) || this.loanApr
        this.loanTermYrs = localStorage.getItem('loanTermYrs', this.loanTermYrs) || this.loanTermYrs
        this.hoaPerMo = localStorage.getItem('hoaPerMo', this.hoaPerMo) || this.hoaPerMo
        this.taxesPerYr = localStorage.getItem('taxesPerYr', this.taxesPerYr) || this.taxesPerYr
        this.mortgageInsPerMo = localStorage.getItem('mortgageInsPerMo', this.mortgageInsPerMo) || this.mortgageInsPerMo
        this.homeownersInsPerMo = localStorage.getItem('homeownersInsPerMo', this.homeownersInsPerMo) || this.homeownersInsPerMo
        this.appreciation = localStorage.getItem('appreciation', this.appreciation) || this.appreciation

        this.loanAprStr = this.loanApr.toString()
        this.appreciationStr = this.appreciation.toString()
      }
    },
    methods: {
      onCalculate: function () {
        if (this.localStorageAvailable) {
          localStorage.setItem('rateType', this.rateType)
          localStorage.setItem('loanAmount', this.loanAmount)
          localStorage.setItem('loanApr', this.loanApr)
          localStorage.setItem('loanTermYrs', this.loanTermYrs)
          localStorage.setItem('hoaPerMo', this.hoaPerMo)
          localStorage.setItem('taxesPerYr', this.taxesPerYr)
          localStorage.setItem('mortgageInsPerMo', this.mortgageInsPerMo)
          localStorage.setItem('homeownersInsPerMo', this.homeownersInsPerMo)
          localStorage.setItem('appreciation', this.appreciation)
        }

        this.results = calc.calcMortgageBreakdown(
          this.loanAmount,
          this.loanApr / 100,
          this.loanTermYrs,
          this.hoaPerMo,
          this.taxesPerYr,
          this.mortgageInsPerMo,
          this.homeownersInsPerMo,
          this.appreciation)
      },

      onExportCsv: function () {
        let csvData = `data:text/csv;charset=utf-8,Year,Month,Mortgage Payment,Towards Interest,Total Owed,Towards Equity,Total Equity,Monthly Cash Due`

        for (let row of this.results) {
          csvData += `\n${row.yr},${row.mo},"${row.pmt}","${row.toInt}","${row.owe}","${row.toEqu}","${row.equ}","${row.totExp}"`
        }

        let encodedUri = encodeURI(csvData)
        let link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', 'mortgage_breakdown.csv')
        document.body.appendChild(link)

        link.click()
      },
    },
    components: {
      DataGrid,
    }
  }
</script>

<style lang="scss" scoped>
  @import '../styles/_shared.scss';

  .breakdown {
    @extend .pnl;
    @extend .hw100;
  }

  .bd-inputs,
  .bd-results,
  .bd-input-wrap,
  .bd-input-grp-wrap {
    @extend .pnl;
    @extend .w100;
  }

  .bd-inputs {
    height: 172px;
    
    .bd-input-grp-wrap {
      @extend .pad1;

      .bd-input-grp {
        @extend .pnl;
        @extend .float-left;

        width: 380px;

        &:not(:first-child) {
          margin-left: 12px;
        }

        .bd-input-wrap {
          @extend .pnl;
          @extend .float-left;

          padding: 2px 0;
          overflow: visible;

          > label {
            display: inline-block;
            width: 180px;

            span {
              display: inline-block;
              float: right;
            }
          }

          > input[type=number], input[type=text] {
            width: 100px;
          }

          .btn {
            display: inline-block;
            float: right;
            margin-left: 4px;
          }
        }
      }
    }
  }

  .bd-results {
    height: calc(100% - 172px);
    overflow: auto;

    .bd-results-hdr-wrap {
        @extend .pnl;
        @extend .w100;
        height: 32px;
        button {
          margin-left: 4px;
        }
    }

    .bd-results-grid-wrap {
      @extend .pnl;
      @extend .hw100;

      background-color: $gray1;
      border: 1px solid $border-color;
      height: calc(100% - 40px);

      table {
        border-right: 1px solid $border-color;
      }
    }
  }
</style>
