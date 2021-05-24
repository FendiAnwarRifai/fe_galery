<template>
    <div class="container" style="padding-top: 30px">
        <div class="row mb-4">
            <div class="col">
                <h2>Photos Galery</h2>
            </div>
            <div class="col d-flex justify-content-end">
                <button @click="modalCreateShow = true" class="btn btn-outline-primary">+ New Photos</button>
            </div>

            <b-modal id="modal-center" v-model="modalCreateShow" centered title="Add Photos">
                <form id="create" class="row g-3" @submit.prevent="createData">
                    <div class="col-12 mb-4">
                      <input type="text" v-model="title" class="form-control" id="title" placeholder="Insert Title Photos">
                    </div>
                    <div class="col-12 mb-4">
                        <label for="file"></label>
                      <input type="file" class="form-control" id="file" @change="handleImage" multiple>
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
        <app-datatable :items="photos" :meta="meta" @per_page="handlePerPage" @pagination="handlePagination" @edit="HandleEditData" @delete="deleteData" @deleteAll="deleteSelected"  @show="ShowPhotos"/>
        <vue-easy-lightbox
        escDisabled
        moveDisabled
        :visible="visible"
        :imgs="imgs"
        @hide="handleHide"
        ></vue-easy-lightbox>
        <b-modal id="modal-center" v-model="modalEditShow" centered title="Edit Photos">
            <form id="edit" class="row g-3" @submit.prevent="editDataPhotos">
                <div class="col-12 mb-4">
                    <input type="text" v-model="editData.title" class="form-control" id="title" placeholder="Insert Title Photos">
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
export default {
  data () {
    return {
      modalCreateShow: false,
      modalEditShow: false,
      photos: [],
      meta: [],
      current_page: 1,
      per_page: 50,
      search: '',
      sortByDesc: true,
      images: '',
      title: '',
      visible: false,
      imgs: '',
      editData: { id: '', title: '' },
      upload: ''
    }
  },
  components: {
    'app-datatable': Datatable
  },
  mounted: function () {
    this.loadData()
  },
  methods: {
    loadData () {
      axios.get(`${process.env.VUE_APP_BASE_URL}/photos`, {
        params: {
          albumId: this.$route.query.albumId,
          page: this.current_page,
          per_page: this.per_page,
          q: this.search,
          sortbydesc: this.sortByDesc ? 'DESC' : 'ASC'
        }
      })
        .then((res) => {
          this.photos = res.data.result
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
    handleImage (e) {
      this.upload = e.target.files[0]
    },
    createData () {
      if (this.title === '' || this.upload === '') {
        return this.$swal.fire({
          title: 'Warning',
          text: 'form cannot be empty',
          icon: 'warning',
          confirmButtonText: 'Ok'
        })
      }
      const data = new FormData()
      data.append('title', this.title)
      data.append('images', this.upload)
      axios.post(`${process.env.VUE_APP_BASE_URL}/photos/create/${this.$route.query.albumId}`, data)
        .then((res) => {
          this.loadData()
          this.modalCreateShow = false
          this.title = ''
          this.$swal.fire({
            title: 'Success',
            text: 'add photos successfully',
            icon: 'success',
            confirmButtonText: 'Ok'
          })
        })
        .catch((error) => {
          this.$swal.fire({
            title: 'Warning',
            text: `${error.response.data.status.message}`,
            icon: 'warning',
            confirmButtonText: 'Ok'
          })
        })
    },
    ShowPhotos (val) {
      this.imgs = val.url
      this.show()
    },
    show () {
      this.visible = true
    },
    handleHide () {
      this.visible = false
    },
    HandleEditData (val) {
      this.modalEditShow = true
      this.editData = { id: val.id, title: val.title }
    },
    editDataPhotos () {
      const payload = { title: this.editData.title }
      axios.patch(`${process.env.VUE_APP_BASE_URL}/photos/update/${this.editData.id}`, payload)
        .then((res) => {
          this.loadData()
          this.modalEditShow = false
          this.$swal.fire({
            title: 'Success',
            text: 'update title photos successfully',
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
      axios.delete(`${process.env.VUE_APP_BASE_URL}/photos/delete/${val}`)
        .then((res) => {
          this.loadData()
          this.$swal.fire({
            title: 'Success',
            text: 'delete photos successfully',
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
        for (let index = 0; index < val.length; index++) {
          axios.delete(`${process.env.VUE_APP_BASE_URL}/photos/delete/${val[index]}`)
        }
        this.$swal.fire({
          title: 'Success',
          text: 'delete photos successfully',
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
