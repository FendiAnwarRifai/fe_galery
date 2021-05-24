<template>
    <div class="container" style="padding-top: 30px">
        <div class="row mb-4">
            <div class="col">
                <h2>Album Galery</h2>
            </div>
            <div class="col d-flex justify-content-end">
                <button @click="modalCreateShow = true" class="btn btn-outline-primary">+ New Album</button>
            </div>

            <b-modal id="modal-center" v-model="modalCreateShow" centered title="Create Album">
                <form id="create" class="row g-3" @submit.prevent="createData">
                    <div class="col-12 mb-4">
                      <input type="text" v-model="title" class="form-control" id="title" placeholder="Insert Title Album">
                    </div>
                </form>
                <template v-slot:modal-footer>
                <div>
                    <b-button class="mr-2" variant="secondary" size="sm" @click="modalCreateShow = false">
                    Close
                    </b-button>
                    <b-button variant="primary" size="sm" type="submit" form="create">
                    create
                    </b-button>
                </div>
                </template>
            </b-modal>
        </div>
        <app-datatable :items="albums" :meta="meta" @per_page="handlePerPage" @pagination="handlePagination" @search="handleSearch" @sort="handleSort" @edit="HandleEditData" @delete="deleteData" @deleteAll="deleteSelected" @show="ShowPhotos"/>

        <b-modal id="modal-center" v-model="modalEditShow" centered title="Edit Album">
                <form id="edit" class="row g-3" @submit.prevent="editDataAlbum">
                    <div class="col-12 mb-4">
                      <input type="text" v-model="editData.title" class="form-control" id="title" placeholder="Insert Title Album">
                    </div>
                </form>
                <template v-slot:modal-footer>
                <div>
                    <b-button class="mr-2" variant="secondary" size="sm" @click="modalEditShow = false">
                    Close
                    </b-button>
                    <b-button variant="primary" size="sm" type="submit" form="edit">
                    Save Changes
                    </b-button>
                </div>
                </template>
        </b-modal>
    </div>
</template>
<script>
import axios from 'axios'
import Datatable from '../components/datatables'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      modalCreateShow: false,
      albums: [],
      items: [],
      meta: [],
      current_page: 1,
      per_page: 50,
      search: '',
      sortByDesc: true,
      title: '',
      modalEditShow: false,
      editData: { id: '', title: '' }
    }
  },
  components: {
    'app-datatable': Datatable
  },
  mounted: function () {
    this.loadData()
  },
  watch: {
    modalCreateShow: function (val) {
      if (val === false) {
        this.title = ''
      }
    }
  },
  methods: {
    ...mapActions(['createAlbums']),
    loadData () {
      axios.get(`${process.env.VUE_APP_BASE_URL}/albums`, {
        params: {
          page: this.current_page,
          per_page: this.per_page,
          q: this.search,
          sortbydesc: this.sortByDesc ? 'DESC' : 'ASC'
        }
      })
        .then((res) => {
          this.items = res.data.result
          this.albums = res.data.result
          this.meta = {
            total: res.data.pagination.rows,
            current_page: this.current_page,
            per_page: this.per_page,
            from: res.data.pagination.from,
            to: res.data.pagination.to
          }
        })
        .catch((error) => {
          console.log('ini error', error)
        })
    },
    handlePerPage () {},
    handlePagination (val) {
      this.current_page = val
      this.loadData()
    },
    handleSearch () {},
    handleSort () {},
    createData () {
      const payload = { title: this.title }
      this.createAlbums(payload)
        .then((res) => {
          this.loadData()
          this.modalCreateShow = false
          this.$swal.fire({
            title: 'Success',
            text: 'Create album successfully',
            icon: 'success',
            confirmButtonText: 'Ok'
          })
        })
        .catch((err) => {
          this.$swal.fire({
            title: 'Warning',
            text: `${err}`,
            icon: 'warning',
            confirmButtonText: 'Ok'
          })
        })
    },
    HandleEditData (val) {
      this.modalEditShow = true
      this.editData = { id: val.id, title: val.title }
    },
    editDataAlbum () {
      const payload = { title: this.editData.title }
      axios.patch(`${process.env.VUE_APP_BASE_URL}/albums/update/${this.editData.id}`, payload)
        .then((res) => {
          this.loadData()
          this.modalEditShow = false
          this.$swal.fire({
            title: 'Success',
            text: 'update title album successfully',
            icon: 'success',
            confirmButtonText: 'Ok'
          })
        })
        .catch((error) => {
          this.$swal.fire({
            title: 'Warning',
            text: `${error}`,
            icon: 'warning',
            confirmButtonText: 'Ok'
          })
        })
    },
    deleteData (val) {
      axios.delete(`${process.env.VUE_APP_BASE_URL}/albums/delete/${val}`)
        .then((res) => {
          this.loadData()
          this.$swal.fire({
            title: 'Success',
            text: 'delete album successfully',
            icon: 'success',
            confirmButtonText: 'Ok'
          })
        })
        .catch((err) => {
          this.$swal.fire({
            title: 'Warning',
            text: `${err}`,
            icon: 'warning',
            confirmButtonText: 'Ok'
          })
        })
    },
    deleteSelected (val) {
      try {
        console.log(val)
        for (let index = 0; index < val.length; index++) {
          axios.delete(`${process.env.VUE_APP_BASE_URL}/albums/delete/${val[index]}`)
        }
        this.$swal.fire({
          title: 'Success',
          text: 'delete album successfully',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((res) => {
          return this.loadData()
        })
      } catch (error) {
        this.$swal.fire({
          title: 'Warning',
          text: `${error}`,
          icon: 'warning',
          confirmButtonText: 'Ok'
        })
      }
    },
    ShowPhotos (val) {
      this.$router.push({ path: '/photos', query: { albumId: val.id } })
    }
  }
}
</script>
