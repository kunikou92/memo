# テスト・レビュー手順

この文書は、レビュー指摘への対応をPR前後に確認するための手順をまとめたものです。

## 1. PRを作成する前の自動チェック

次のコマンドを上から順に実行します。

```powershell
npm run lint
npm run typecheck
npm run build
```

すべてエラーなく終了することを確認します。環境固有のTurbopackエラーが出た場合は、原因を切り分けるため次のコマンドでもビルドを確認します。

```powershell
npx next build --webpack
```

## 2. DBマイグレーションの確認と適用

Vercelへのデプロイでは、`supabase/migrations`のSQLはSupabaseへ自動適用されません。レビューとマージが完了した後、次の順番で確認します。

```powershell
npx supabase login
npx supabase link
npx supabase migration list
npx supabase db push --dry-run
```

このプロジェクトでは初期のDB構造をSupabaseのSQL Editorから作成している可能性があります。`migration list`のLOCALとREMOTEが一致しない場合や、`--dry-run`に`20261017000000_create_notes.sql`が表示された場合は、まだ`db push`を実行しません。既存DBとマイグレーション履歴が一致しているか確認してから修復方法を決めます。

適用予定が次の未適用ファイルだけであることを確認します。

- `20261018000000_add_note_length_constraints.sql`
- `20261018000001_add_note_write_rate_limit.sql`

問題がなければ適用します。

```powershell
npx supabase db push
```

## 3. 手動受け入れテスト

本番データへ影響させないため、確認専用のユーザーとメモを使用します。

### 3.1 DBの文字数制限

SupabaseのSQL Editorで、`<テストユーザーのUUID>`を実在する確認用ユーザーのIDへ置き換えて実行します。

```sql
insert into public.notes (user_id, title, content)
values ('<テストユーザーのUUID>', repeat('あ', 101), '');
```

`notes_title_length_check`違反になり、メモが保存されないことを確認します。

```sql
insert into public.notes (user_id, title, content)
values ('<テストユーザーのUUID>', '本文上限テスト', repeat('あ', 10001));
```

`notes_content_length_check`違反になり、メモが保存されないことを確認します。

### 3.2 ページネーション

1. 確認用ユーザーで21件以上のメモを用意します。
2. `/notes`を開き、1ページ目の表示が20件以下であることを確認します。
3. 「次のページ」を押し、21件目以降が表示されることを確認します。
4. 「前のページ」を押し、1ページ目へ戻れることを確認します。
5. `/notes?page=0`や存在しない大きなページ番号を開き、正常な一覧URLへ戻ることを確認します。

### 3.3 レート制限

レート制限は、メモの作成・更新・削除を合計して認証ユーザー1人につき1分間30回です。

1. 時計の分が切り替わった直後から、確認用ユーザーでメモの保存または削除を繰り返します。
2. 30回目までは成功することを確認します。
3. 同じ分の31回目は失敗し、「操作が多すぎます」という案内が表示されることを確認します。
4. 時計の分が切り替わった後、再び保存できることを確認します。
5. 別の確認用ユーザーには同じ制限回数が引き継がれないことを確認します。

### 3.4 回帰確認

- 新規登録、メール認証、ログインができる
- メモの作成、一覧、編集、削除ができる
- 自分以外のメモを取得・更新・削除できない
- 通常のログアウト後、このアプリの`sb-<project-ref>-auth-token`から始まるCookieが残っていない
- 通常のログアウト後に`/notes`へ戻れない
- Supabase Authとの通信が失敗する状況でもローカル認証Cookieが削除され、`/notes`へ戻れない
- PC幅とスマートフォン幅でページ移動を操作できる

## 4. 確認結果の記録

確認できた項目は`TODO.md`の「21. 追加修正の確認」にチェックを入れます。DBマイグレーション適用前の項目は、未確認のままPR本文へ記載します。
