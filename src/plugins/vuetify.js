import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme:{
        dark:true,
        themes:{
            dark:{
                primary:"#3f3f3f"
            },
            light:{
                primary:"#2ECC71"
            }
        }
    }
});
