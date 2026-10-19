<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The homepage is a read-only overview of the existing CMS: detailed content stays on dedicated routes so presentation changes never mutate school records.
- The Kegiatan homepage shortcut uses the existing agenda route; do not introduce a duplicate activity page.
- Keep storage buckets private and direct reads admin-only; public signed links require exact published-reference authorization through a server publishable client before privileged signing, preserving visitor access without granting storage listing or arbitrary signing.
