export const USER_MESSAGES = {
  communicationError:
    "通信に失敗しました。接続を確認して再度お試しください。",
  auth: {
    signupFailed:
      "新規登録に失敗しました。時間をおいて再度お試しください。",
    loginFailed:
      "ログインに失敗しました。時間をおいて再度お試しください。",
    confirmationFailed:
      "認証リンクを確認できませんでした。リンクの期限切れ、または使用済みの可能性があります。",
  },
  notes: {
    loadFailed:
      "メモを読み込めませんでした。時間をおいて再度お試しください。",
    saveFailed:
      "メモを保存できませんでした。時間をおいて再度お試しください。",
    deleteFailed:
      "メモを削除できませんでした。時間をおいて再度お試しください。",
    rateLimitExceeded:
      "操作が多すぎます。1分ほど待ってから再度お試しください。",
    unavailable:
      "対象のメモを確認できませんでした。一覧から開き直してください。",
  },
} as const;
