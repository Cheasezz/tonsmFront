import {
  mockTelegramEnv,
  isTMA,
  retrieveRawLaunchParams,
  serializeLaunchParamsQuery,
} from '@telegram-apps/sdk-vue'
import type { LaunchParams } from '@telegram-apps/sdk-vue'

// It is important, to mock the environment only for development purposes.
// When building the application the import.meta.env.DEV will value become
// `false` and the code inside will be tree-shaken (removed), so you will not
// see it in your final bundle.
if (import.meta.env.DEV) {
  await (async () => {
    if (await isTMA('complete')) {
      return
    }

    // Determine which launch params should be applied. We could already
    // apply them previously, or they may be specified on purpose using the
    // default launch parameters transmission method.
    let lp: string | undefined
    try {
      lp = retrieveRawLaunchParams()
    } catch {
      const initData = {
        user: {
          id: 99281932,
          first_name: 'Andrew',
          last_name: 'Rogue',
          username: 'rogue',
          language_code: 'en',
          is_premium: true,
          allows_write_to_pm: true,
        },
        hash: '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31',
        auth_date: new Date(1716922846),
        start_param: 'debug',
        chat_type: 'sender',
        chat_instance: '8428209589180549439',
        signature: '',
      }

      lp = serializeLaunchParamsQuery({
        tgWebAppThemeParams: {
          accent_text_color: '#6ab2f2',
          bg_color: '#17212b',
          button_color: '#5288c1',
          button_text_color: '#ffffff',
          destructive_text_color: '#ec3942',
          header_bg_color: '#17212b',
          hint_color: '#708499',
          link_color: '#6ab3f3',
          secondary_bg_color: '#232e3c',
          section_bg_color: '#17212b',
          sectionHeader_text_color: '#6ab3f3',
          subtitle_text_color: '#708499',
          text_color: '#f5f5f5',
        },
        tgWebAppData: initData,
        tgWebAppVersion: '8',
        tgWebAppPlatform: 'tdesktop',
      })
    }

    mockTelegramEnv({
      launchParams: lp,
      onEvent: (event, next) => {
        console.log('Mock event:', event)
        next()
      },
      resetPostMessage: false,
    })
    console.warn(
      '⚠️ As long as the current environment was not considered as the Telegram-based one, it was mocked. Take a note, that you should not do it in production and current behavior is only specific to the development process. Environment mocking is also applied only in development mode. So, after building the application, you will not see this behavior and related warning, leading to crashing the application outside Telegram.',
    )
  })()
}
