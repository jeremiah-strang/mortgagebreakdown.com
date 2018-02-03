<template>
  <table>
    <thead>
      <tr>
        <th v-for="col in columns"
          @click="sortBy(col.key)"
          :class="{ active: sortKey == col.key }">
          {{ col.title }}
          <span v-if="sortKey == col.key" class="arrow" :class="sortOrders[col.key] > 0 ? 'asc' : 'dsc'"></span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in filteredData">
        <td v-for="col in columns" :class="col.rowClass">
          {{entry[col.key]}}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'data-grid',
  props: {
    data: Array,
    columns: Array,
    filterKey: String,
  },
  data: function () {
    let sortOrders = {}
    this.columns.forEach((key) => {
      sortOrders[key] = 1
    })

    return {
      sortKey: '',
      sortOrders: sortOrders
    }
  },
  computed: {
    filteredData: function () {
      let sortKey = this.sortKey
      let filterKey = this.filterKey && this.filterKey.toLowerCase()
      let order = this.sortOrders[sortKey] || 1
      let data = this.data
      if (filterKey) {
        data = data.filter((row) => {
          return Object.keys(row).some((key) => {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort((a, b) => {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    },
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../styles/_shared.scss';

table {
  border-radius: 3px;
  background-color: #fff;

  th, td {
    min-width: 50px;
    padding: 4px 8px;
    white-space: nowrap;
  }

  th {
    background-color: $gray3;
    color: $font-dark;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-weight: normal;

    &.active {
      background-color: $gray5;

      .arrow {
        opacity: 1;
      }
    }
  }

  td {
    &.usd {
      text-align: right;
    }

    &.usd {
      &::before {
        content: '$';
        color: #aaa;
        display: inline;
        float: left;
        margin-right: 8px;
      }
    }
  }

  tr:nth-child(even) td {
    background-color: darken($gray1, 2%);
  }
}

</style>
