<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title>Profil</ion-title>
                <ion-button slot="end" fill="clear" @click="logout" style="--color: gray;">
                    <ion-icon slot="end" :icon="exit"></ion-icon>
                    <ion-label>Logout</ion-label>
                </ion-button>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div id="profile-container">
                <div id="avatar-container">
                    <ion-avatar>
                        <img alt="Avatar" :src="userPhoto" @error="handleImageError" />
                    </ion-avatar>
                </div>
                <div class="profile-info">
                    <h1>{{ user?.displayName || 'Pengguna' }}</h1>
                    <p>{{ user?.email || 'Email tidak tersedia' }}</p>
                </div>
            </div>
            <TabsMenu />
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonIcon, IonButton, IonAvatar } from '@ionic/vue';
import { exit } from 'ionicons/icons';
import { computed, ref } from 'vue';
import TabsMenu from '@/components/TabsMenu.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const logout = () => {
    authStore.logout();
};

const userPhoto = ref(user.value?.photoURL || 'https://ionicframework.com/docs/img/demos/avatar.svg');

function handleImageError() {
    userPhoto.value = 'https://ionicframework.com/docs/img/demos/avatar.svg';
}
</script>

<style scoped>
#profile-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 20px;
}

#avatar-container ion-avatar {
    width: 100px;
    height: 100px;
    margin-bottom: 20px;
}

.profile-info h1 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
}

.profile-info p {
    font-size: 16px;
    color: #6b6b6b;
    margin-bottom: 20px;
}

ion-button[slot="end"] {
    --padding-start: 0;
    --padding-end: 0;
}
</style>
