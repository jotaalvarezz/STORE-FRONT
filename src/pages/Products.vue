<template>
  <q-page>
    <q-card class="my-card" style="margin: 15px;">
      <q-card-actions>
        <div class="text-h6">Productos My Store</div>
      </q-card-actions>

      <q-card-actions>
        <q-btn color="primary" icon="library_add" label="Agregar Producto" @click="carrusel = true" />
      </q-card-actions>

      <q-dialog v-model="carrusel">
        <q-card class="my-card" style="width: 80%;">
          <q-card-section>
            <div class="text-h6 text-center">Registrar Producto</div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div  style="margin: 20px;">
              <div class="row">
                <div class="col-md-12">
                  <q-input standout="bg-grey-4 text-white" v-model="model.name" label="Nombre" />
                </div>
              </div>
              <div class="row" style="margin-top: 8px;">
                <div class="col-md-12">
                  <q-input standout="bg-grey-4 text-white" type="number" v-model="model.price" label="Precio" />
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="negative" v-close-popup />
            <q-btn flat label="Aceptar" color="positive" @click="storeProduct" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-separator inset />

      <q-card-section>
        <div class="row">
          <div class="col-12">
            <q-table title="Productos" flat bordered :columns="header" :rows="products" row-key="name">
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th auto-width />
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.field }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td auto-width>
                    <q-btn size="sm" color="primary" round dense @click="deleteProduct(props.row.id, props.rowIndex)"
                      :icon="props.expand ? 'remove' : 'add'" />
                  </q-td>
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.value }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <!--  -->
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { api } from 'src/boot/axios';
import { onMounted } from 'vue';
import { useQuasar } from 'quasar'
/* import { confirm } from '../alerts/alerts' */

const $q = useQuasar()
const products = ref([])
let carrusel = ref(false)
let model = ref({})

const header = ref([
  {
    name: 'producto',
    label: 'Nombre',
    field: 'name',
    align: 'left',
    headerStyle: 'width: 120px',
    sortable: true
  },
  {
    name: 'precio',
    label: 'Precio',
    field: 'price',
    align: 'left',
    headerStyle: 'width: 100px',
  },
  {
    name: 'imagen',
    label: 'Imagen',
    field: 'image',
    align: 'left',
    headerStyle: 'width: 160px',
  }
])

const getProducts = async () => {
  try {
    products.value = []
    const res = await api.get('/api/v1/products')
    console.log("res ", res)
    products.value = res.data
    console.log("products ", products)
  } catch (error) {
    console.log(error)
  }
}

const storeProduct = async () => {
  try {
    console.log("model ",model.value)
    const res = await api.post('/api/v1/products/create', model.value)
    console.log("add ",res)
    products.value.push(res.data.data)
    model.value = []
  } catch(error) {
    console.log("Ah ocurrido un error...")
  }
}

const deleteProduct = async (id, index) => {
  $q.dialog({
    dark: true,
    title: 'Eliminar Registro',
    message: 'Se eliminara el producto!',
    cancel: true,
    persistent: true
  }).onOk(() => {
    try {
      const res = api.delete('/api/v1/products/delete/' + id)
      console.log("eliminado ", res)
      products.value.splice(index, 1)
    } catch (error) {
      console.log("error ", error)
    }
  })
}

onMounted(() => {
  getProducts()
})
//getProducts()
</script>
