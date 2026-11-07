# Roomstead

Roomstead is a mobile-first checklist for home projects. Open a room to check off items and see its progress, or use the Shopping tab to check off purchases across all rooms.

## Open the app on your phone

Open **Deploy Roomstead** in [GitHub Actions](https://github.com/Owningturtle287/Home-To-Do-List/actions/workflows/pages.yml). Select a successful run and tap the site URL on its **deploy** card. On iPhone, open the site in Safari and choose **Share → Add to Home Screen**.

The public site starts with the sample checklist. Checkmarks and edits are saved in the browser on the current device.

For the first deployment, set **Settings → Pages → Source** to **GitHub Actions**.

## Run locally

Serve the project folder with Python 3 and open the URL below.

```sh
python3 -m http.server 8000
```

[Open Roomstead](http://localhost:8000)

## Customize your checklist

- Use **Add room** to create a room and choose its illustration. Edit an existing room from its checklist.
- Add, rename, or delete sections and individual items. A section can also appear in the Shopping tab.
- The whole-house percentage is based on all checklist items across rooms, including purchases and optional items. An empty room shows 0%.
- The app starts with sample rooms and items from `seed.js`. Edits and checkmarks are stored in the current browser on the current device.
