<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Confirmation</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="preview" style="--background: transparent!important;">
    <div :hidden="isSaved" style="text-align: center; padding-top: 70px">
      <ion-text>Image enregistrée avec succès</ion-text>
      <div><ion-icon :icon="checkmarkCircleOutline" style="height: 40px; width: 40px" color="success"></ion-icon></div>
    </div>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardTitle, IonIcon, IonText } from '@ionic/vue';
import {checkmarkCircleOutline} from "ionicons/icons";
document.body.style.backgroundColor = "transparent !important"

export default defineComponent({
  name: 'Tab3Page',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonIcon, IonText },
  setup() {
    return {
      checkmarkCircleOutline
    }
  },
  data(){
    return {
      isHidden: true
    }
  },
  ionViewDidEnter() {
    if (this.$route.query.isSaved.toString() == 'true') {
      this.isHidden = false
      this.$route.query.isSaved = 'false'
    }
    else {
      this.isHidden = true
    }
  },
  methods: {
  }
});
</script>

<style>
ion-content {
  background-color: transparent;
}
</style>
