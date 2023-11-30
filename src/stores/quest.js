import { reactive } from 'vue'
export const dto = reactive({
  id: null,
  title: '',
  description: '',
  deadLine: '',
  details: [],
  submitting: false,
  reset() {
    this.id = null
    this.title = ''
    this.description = ''
    this.deadLine = ''
    this.details = []
  },
  set(quest) {
    this.id = quest.id
    this.title = quest.title
    this.description = quest.description
    this.deadLine = quest.deadLine
    this.details = quest.detailQuests.map((detail) => {
      return {
        title: detail.title,
        description: detail.description,
        type: detail.type,
        targetCount: detail.targetCount
      }
    })
  }
})
