const selectFolderSave = document.getElementById('select-folder-span')
const fileNameLabel = document.getElementById('file-name-label')
const selectQualityLabel = document.getElementById('select-quality-label')

try {
i18n.configure({
  directory: 'locales',
  defaultLocale: preferences.global.language
})
} catch (error) {
    console.error(error)
}

;(selectFolderSave != null) && (selectFolderSave.textContent = i18n.__('Select a folder to save'))
;(fileNameLabel != null) && (fileNameLabel.textContent = i18n.__('File name'))
;(fileNameInput != null) && (fileNameInput.placeholder = i18n.__('File name'))
;(btnQualities != null) && (btnQualities.textContent = i18n.__('Get Qualities'))
;(selectQualityLabel != null) && (selectQualityLabel.textContent = i18n.__('Select Quality'))
;(btnDownload != null) && (btnDownload.textContent = i18n.__('Download'))
;(btnResetFields != null) && (btnResetFields.textContent = i18n.__('Reset fields'))
;(btnOpenFileFolder != null) && (btnOpenFileFolder.textContent = i18n.__('Open file folder'))
;(downloadProgress != null) && (downloadProgress.innerHTML = i18n.__('Downloading'))
;(downloadFinished != null) && (downloadFinished.innerHTML = i18n.__('Download finished'))
