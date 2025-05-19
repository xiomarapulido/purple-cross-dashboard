import { ref, computed } from 'vue'
import { en } from './en'

const currentLocale = ref('en')

const localeTexts = computed(() => {
    switch (currentLocale.value) {
        case 'en':
            return en
        default:
            return en
    }
})

export function useTexts() {
    return {
        texts: localeTexts,
        setLocale: (locale: string) => {
            currentLocale.value = locale
        },
    }
}
