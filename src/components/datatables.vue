<template>
    <div>
      <div class="row mb-4">
        <div class="col-12 d-flex justify-content-start" v-if="selectIdData.length > 0 ">
          <span @click="deleteSelected" class="btn btn-danger btn-sm me-2">delete all marked</span>
        </div>
      </div>
      <div class="row row-cols-1 row-cols-md-5">
            <div class=" col mb-4"  v-for="data in items" :key="data.id">
                <div class="card">
                <div v-if="data.thumbnailUrl" style="overflow:hidden; height:165px;" class="d-flex align-items-center justify-content-center">
                  <img style="width:100%;" class="cursor" :src="data.thumbnailUrl" @click="show(data)">
                </div>
                <div @click="show(data)" class="cursor card-body">{{data.title.length > 15 ? data.title.substring(0, 15)+'...' : data.title.substring(0, 15) }}
                </div>
                  <div class="card-footer" style="position:relative">
                    <i class="cursor mr-2 text-primary" @click="EditData(data)">edit</i>
                    <i class="cursor text-danger" @click="DeleteData(data.id)">delete</i>
                    <input style="position:absolute; top:12px; right:12px;" class="form-check-input" :id="data.id" type="checkbox" :value="data.id" v-model="selectIdData">
                  </div>
                </div>
            </div>
      </div>

      <div class="row">
        <div class="col-md-6">
            <p>Showing {{ meta.from }} to {{ meta.to }} of {{ meta.total }} items</p>
        </div>

        <div class="col-md-6">
            <b-pagination
                pills
                v-model="meta.current_page"
                :total-rows="meta.total"
                :per-page="meta.per_page"
                align="right"
                @change="changePage"
                aria-controls="dw-datatable"
            ></b-pagination>
        </div>
      </div>

    </div>
</template>

<script>
import _ from 'lodash' // membuat delay di kolom pencarian saat diisi

export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    meta: {
      required: true
    }
  },
  data () {
    return {
      selectIdData: [],
      sortDesc: false,
      selected: null
    }
  },
  watch: {
    sortDesc (val) {
      this.$emit('sort', {
        sortDesc: this.sortDesc
      })
    }
  },
  methods: {
    loadPerPage (val) {
      this.$emit('per_page', this.meta.per_page)
    },

    changePage (val) {
      this.$emit('pagination', val)
    },

    search: _.debounce(function (e) {
      this.$emit('search', e.target.value)
    }, 500),
    EditData (row) {
      this.selected = row
      this.$emit('edit', this.selected)
    },
    // detailData (row) {
    //   this.selected = row.item
    //   this.$emit('detail', this.selected)
    // },
    deleteSelected () {
      this.$emit('deleteAll', this.selectIdData)
      this.selectIdData = []
    },
    DeleteData (row) {
      this.selected = row
      this.$emit('delete', this.selected)
    },
    show (val) {
      this.$emit('show', val)
    }
  }
}
</script>
<style scoped>
.cursor{
  cursor: pointer;
}
.buttonAction{
  position: absolute;
  right: 8px;
  top: 12px;
}
</style>
