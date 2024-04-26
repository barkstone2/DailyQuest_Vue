import {reactive} from "vue";

export const dto = reactive({
  id: null,
  title: '',
  description: '',
  details: [],
  reset() {
    this.id = null
    this.title = ''
    this.description = ''
    this.deadLine = ''
    this.details = []
  },
  set(preferenceQuest) {
    this.id = preferenceQuest.id
    this.title = preferenceQuest.title
    this.description = preferenceQuest.description
    this.details = preferenceQuest.preferenceDetailQuests
  }
})
