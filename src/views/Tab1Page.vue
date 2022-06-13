<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Accueil</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Sélectionner un membre de la DIVTEC</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-searchbar placeholder="Rechercher un membre de la DIVTEC"></ion-searchbar>
      <ion-list>
        <ion-item @click="presentAlertConfirm()">
          <ion-label>Automaticien-ne CFC</ion-label>
          <ion-icon :icon="chevronForward" slot="end"></ion-icon>
        </ion-item>
        <ion-item @click="presentAlertConfirm()">
          <ion-label>Dessinateur-trice CFC</ion-label>
          <ion-icon :icon="chevronForward" slot="end"></ion-icon>
        </ion-item>
      </ion-list>
        <ion-fab vertical="bottom" horizontal="center" slot="fixed" id="trigger-button" style="text-align: center">
          <ion-fab-button @click="presentAlertPrompt()">
            <ion-icon :icon="add"></ion-icon>
          </ion-fab-button>
        </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSearchbar,
  IonIcon,
  alertController,
  IonFab,
  IonFabButton,
  IonText

} from '@ionic/vue';
import {chevronForward, add} from "ionicons/icons";
import router from "@/router";

export default defineComponent({
  name: 'Tab1Page',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonList,
    IonItem,
    IonLabel,
    IonSearchbar,
    IonIcon,
    IonFab,
    IonFabButton,
  },
  setup() {
    return {
      chevronForward,
      add
    }
  },
  methods: {
    async presentAlertConfirm() {
      const alert = await alertController
          .create({
            header: 'Confirmation',
            message: 'Souhaitez-vous commencer la prise de photo pour Prenom Nom',
            buttons: [
              {
                text: 'Annuler',
                role: 'cancel',
              },
              {
                text: 'Commencer',
                role: 'confirm',
                handler: () => {
                  router.push('/tabs/tab2')
                },
              },
            ],
          });
      return alert.present();
    },
    async presentAlertPrompt() {
      const alert = await alertController
          .create({
            cssClass: 'my-custom-class',
            header: 'Créer un nouveau profil',
            message: 'Souhaitez-vous créer un nouveau profil afin de prendre en photo une personne inexistante dans le registre ?',
            inputs: [
              {
                name: 'prenom_name',
                id: 'prenom-id',
                placeholder: 'Prenom',
              },
              {
                name: 'nom_name',
                id: 'nom-id',
                placeholder: 'Nom',
              }
            ],
            buttons: [
              {
                text: 'Annuler'
              },
              {
                text: 'Confirmer',
                handler: (alertData) => {
                  router.push({path:'/tabs/tab2', query:{ _prenom: alertData.prenom_name, _nom: alertData.nom_name}})
                },
              },
            ],
          });
      return alert.present();
    },
    async getApprentis() {
      commit('SET_APPRENTIS_CHARGES', false)
      const config = {
        headers: { Authorization: 'Bearer ' + rootState.auth.token }
      }
      apiDivtec.get(
          // TODO dans API renommer smestres en semestre
          `ecoles/1/annees/2/smestres/2/eleves`
          , config)
          .then(function (response) {
            commit('SET_APPRENTIS', response.data)
            commit('SET_APPRENTIS_CHARGES', true)
          })
          .catch(function () {
            afficherMessageErreur(
                'Erreur lors de la récupération des apprentis !'
            )
          })
    },
  }
});
</script>
