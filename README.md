## Windowed for Safari

The [Windowed extension](https://github.com/dralletje/Windowed) for [Apple Safari](https://www.apple.com/safari/).
It has the same functionality as the [Chrome extension](https://chromewebstore.google.com/detail/windowed-floating-youtube/gibipneadnbflmkebnmcbgjdkngkbklb).

<br>
<table cellpadding="2">
<!-- TABLE HEADER -->
<th valign="middle">Windowed</th>
<th valign="middle">Version</th>
<th valign="middle">Link</th>
<!-- TABLE BODY -->
<tr>
  <td valign="middle" align="center"><img src="extension/Images/Icon-512.png" width="48"></td>
  <td valign="middle" align="center"><tt>1.0.1</tt></td>
  <td valign="middle" align="center"><a href="https://github.com/kaiyuyue/Windowed-Safari/releases/download/1.0.1/Windowed.app.zip"><tt>Download</tt></a></td>
</tr>
</table>
<br>


## Installation

- Download the file `Windowed.app.zip` from [latest release](https://github.com/kaiyuyue/Windowed-Safari/releases).
- Unzip the file and drag it to your `Applications` folder.
- **In the Applications folder, right-click** the `Windowed.app` and select `Open`. Then it will pop up the app like this:

<p align="center">
  <img src="./assets/open.png" width=384>
  <br>
</p>

- After that, you can open the app normally.

<p align="center">
  <img src="./assets/intro.png" width=512>
  <br>
</p>

## New UI

- **Toolbar Button**

<p align="center">
  <img src="./assets/pop-up-toolbar.png">
  <br>
</p>

- **Pop-up** 

<p align="center">
  <img src="./assets/pop-up-video.png">
  <br>
</p>

- **In-Window Mode**

<p align="center">
  <img src="./assets/in-window.png">
  <br>
</p>

- **Picture-in-Picture Mode**

<p align="center">
  <img src="./assets/pic-in-pic.png">
  <br>
</p>

## Development

- Clone the repo
- Run `bash convert.sh` to convert the original Chrome extension to Safari extension (the converted extension will be in the `windowed-safari-app` folder)
- Develop and modify the code in Xcode
- Contributions and PRs are definitely welcome to make it better for Safari

> [!NOTE]
> The released extension is signed with my own Apple Developer ID without any verification from Apple Developer Program. So it won't show up in the Apple Extension Gallery - App Store. It would be great if someone can help me to sign the extension with a verified Apple Developer ID to distribute it in the App Store. Please contact me if you are willing to help. :bowtie:

## Credits

- [Windowed](https://github.com/dralletje/Windowed)
