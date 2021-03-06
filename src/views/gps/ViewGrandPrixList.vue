<template>
    <div id="gplist" class="box">

        <progno-page-title name="Grandes Premios" />

        <div class="columns is-variable is-5">
            <div class="column is-8">
                <b-tabs v-model="activeTab" v-if="seasonReady && competitionReady">
                    <b-tab-item label="Próximos">
                        <GrandPrixesList :competition="competition" :season="season" searchType="next"/>
                    </b-tab-item>

                    <b-tab-item label="Pasados">
                        <GrandPrixesList :competition="competition" :season="season" searchType="past"/>
                    </b-tab-item>

                    <b-tab-item label="Todos">
                        <GrandPrixesList :competition="competition" :season="season" searchType="all"/>
                    </b-tab-item>
                </b-tabs>
                <loading v-else />
            </div>
            <div class="column is-4">
                <NextGrandPrix />
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import {Component, Vue, Watch} from "vue-property-decorator";
    import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
    import NextGrandPrix from "@/components/gps/NextGrandPrix.vue";
    import GrandPrixesList from "@/components/gps/GrandPrixesList.vue";
    import {Competition} from "@/types/Competition";
    import {Season} from "@/types/Season";
    import {seasonService} from "@/_services";
    import {Community} from "@/types/Community";
    import {namespace} from "vuex-class";
    const Auth = namespace('Auth')

    @Component<ViewGrandPrixList>({
        components: {
            GrandPrixesList,
            NextGrandPrix,
            PrognoPageTitle
        }
    })
    export default class ViewGrandPrixList extends Vue {

        private competition!: Competition;
        private season!: Season;
        @Auth.State("community") private currentCommunity!: Community;

        private shouldSearchDefaultCompetition: boolean = false;
        private shouldSearchDefaultSeason: boolean = false;
        private activeTab: number = 0;

        private competitionReady: boolean = false;
        private seasonReady: boolean = false;

        created() {
            this.competition = { code: this.$route.params.competition } as Competition;
            this.season = { name: this.$route.params.season } as Season;

            if (this.competition.code == undefined) {
                this.shouldSearchDefaultCompetition = true;
            } else {
                this.competitionReady = true;
            }

            if (this.season.name == undefined) {
                this.shouldSearchDefaultSeason = true;
                this.searchDefaultSeason();
            } else {
                this.seasonReady = true;
            }
        }

        @Watch('currentCommunity')
        onCurrentCommunityChange(community: Community) {
            this.searchDefaultCompetition();
        }

        /**
         * Buscar la competición si no se ha especificado en la url. Esta saldrá de la comunidad actual
         */
        public searchDefaultCompetition(): void {
            if (this.shouldSearchDefaultCompetition) {
                this.competition = this.currentCommunity.competition;
                this.competitionReady = true;
                this.searchDefaultSeason();
            }
        }

        /**
         * Buscar la temporada actual de la competición buscada si esta no se ha especificado en la url
         */
        public searchDefaultSeason(): void {
            if (this.shouldSearchDefaultSeason) {
                seasonService.getCurrentSeason(this.currentCommunity.competition).then((season) => {
                    this.season = season;
                    this.seasonReady = true;
                });
            }
        }

    }
</script>
