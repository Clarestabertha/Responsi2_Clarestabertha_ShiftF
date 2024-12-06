<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200"
        @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="isOpen = true;">
          <ion-icon :icon="add" size="large"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <InputModal v-model:isOpen="isOpen" v-model:editingId="editingId" :todo="todo" @submit="handleSubmit" />
    </ion-content>
  </ion-page>

  <div class="scrollable-container">
    <ion-list>
      <ion-item-sliding v-for="todo in todos" :key="todo.id" :ref="(el) => setItemRef(el, todo.id!)">
        <ion-item-options side="start" @ionSwipe="showDeleteAlert(todo)">
          <ion-item-option color="danger" expandable @click="showDeleteAlert(todo)">
            <ion-icon slot="icon-only" :icon="trash" size="large"></ion-icon>
          </ion-item-option>
        </ion-item-options>
        <ion-item>
          <ion-card>
            <ion-card-header>
              <ion-card-title class="ion-text-wrap limited-text">{{ todo.pahlawan }}</ion-card-title>
              <ion-card-subtitle class="limited-text">{{ todo.kisah }}</ion-card-subtitle>
            </ion-card-header>
          </ion-card>
        </ion-item>
        <ion-item-options side="end" @ionSwipe="handleEdit(todo)">
          <ion-item-option @click="handleEdit(todo)">
            <ion-icon slot="icon-only" :icon="create" size="large"></ion-icon>
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-list>
  </div>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonFab,
  IonFabButton,
  IonLabel,
  IonList,
  IonRefresher,
  IonRefresherContent,
  loadingController,
  toastController,
  alertController
} from '@ionic/vue';
import {
  add,
  create,
  trash,
  checkmarkCircle,
  closeCircle
} from 'ionicons/icons';
import InputModal from '@/components/InputModal.vue';
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { firestoreService, type Todo } from '@/utils/firestore';
import { formatDistanceToNow } from 'date-fns';

const isOpen = ref(false);
const editingId = ref<string | null>(null);
const todos = ref<Todo[]>([]);
const todo = ref<Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'status'>>({
  pahlawan: '',
  kisah: '',
});
const itemRefs = ref<Map<string, HTMLIonItemSlidingElement>>(new Map());
let intervalId: any;
const timeUpdateTrigger = ref(0);
const setItemRef = (el: any, id: string) => {
  if (el) {
    itemRefs.value.set(id, el.$el);
  }
};
const showToast = async (message: string, color: string = 'success', icon: string = checkmarkCircle) => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color,
    position: 'top',
    icon
  });
  await toast.present();
};
const handleRefresh = async (event: any) => {
  try {
    await loadTodos(false);
  } catch (error) {
    console.error('Error refreshing:', error);
  } finally {
    event.target.complete();
  }
};

const handleSubmit = async (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
  if (!todo.pahlawan) {
    await showToast('Kolom Pahlawan harus diisi', 'warning');
    return;
  }
  try {
    if (editingId.value) {
      await firestoreService.updateTodo(editingId.value, todo as Todo);
      await showToast('Data Berhasil Terupdate');
    } else {
      await firestoreService.addTodo(todo as Todo);
      await showToast('Data Berhasil Ditambahkan');
    }
    loadTodos();
  } catch (error) {
    await showToast('An error occurred', 'danger', closeCircle);
    console.error(error);
  } finally {
    editingId.value = null;
  }
};
const loadTodos = async (isLoading = true) => {
  let loading;
  if (isLoading) {
    loading = await loadingController.create({
      message: 'Loading...'
    });
    await loading.present();
  }

  try {
    todos.value = await firestoreService.getTodos();
  } catch (error) {
    console.error(error);
  } finally {
    if (loading) {
      await loading.dismiss();
    }
  }
};
onMounted(() => {
  loadTodos();
  intervalId = setInterval(() => {
    timeUpdateTrigger.value++;
  }, 60000);
});
onUnmounted(() => {
  clearInterval(intervalId);
});
const handleEdit = async (editTodo: Todo) => {
  const slidingItem = itemRefs.value.get(editTodo.id!);
  await slidingItem?.close();

  editingId.value = editTodo.id!;
  todo.value = {
    pahlawan: editTodo.pahlawan,
    kisah: editTodo.kisah,
  }
  isOpen.value = true;
}
const showDeleteAlert = async (deleteTodo: Todo) => {
  const alert = await alertController.create({
    header: 'Konfirmasi Penghapusan',
    message: 'Apakah Anda yakin ingin menghapus todo ini?',
    buttons: [
      {
        text: 'Batal',
        role: 'cancel',
        cssClass: 'secondary',
      },
      {
        text: 'Hapus',
        handler: async () => {
          await handleDelete(deleteTodo);
        }
      }
    ]
  });
  await alert.present();
};
const handleDelete = async (deleteTodo: Todo) => {
  try {
    await firestoreService.deleteTodo(deleteTodo.id!);
    await showToast('Data Berhasil Terhapus');
    loadTodos();
  } catch (error) {
    await showToast('Gagal Untuk Menghapus Data', 'danger', closeCircle);
    console.error(error);
  }
};
</script>

<style scoped>
</style>