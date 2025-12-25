# GitHub'a Yükleme Adımları

## 1. GitHub'da Repository Oluşturma

1. https://github.com/new adresine gidin
2. Repository adını girin (örn: "MonFair")
3. Public veya Private seçin
4. **ÖNEMLİ**: "Initialize this repository with a README" kutusunu **İŞARETLEMEYİN**
5. "Create repository" butonuna tıklayın

## 2. GitHub'a Yükleme Komutları

Repository oluşturduktan sonra, GitHub size bir URL verecek. O URL'yi kullanarak aşağıdaki komutları çalıştırın:

### Windows PowerShell için:

```powershell
# GitHub repository URL'inizi buraya yazın (örnek: https://github.com/kullaniciadi/MonFair.git)
$GITHUB_URL = "BURAYA_GITHUB_URL_NIZI_YAZIN"

# Remote repository'yi ekle
git remote add origin $GITHUB_URL

# Tüm dosyaları staging area'ya ekle
git add .

# Değişiklikleri commit et
git commit -m "Initial commit to GitHub"

# Ana branch'i push et
git branch -M main
git push -u origin main
```

### Alternatif olarak (URL'yi direkt yazarak):

```powershell
# Remote ekle (URL'yi kendi repository URL'inizle değiştirin)
git remote add origin https://github.com/KULLANICI_ADI/REPOSITORY_ADI.git

# Branch'i main olarak ayarla (zaten main'deyseniz bu adım gerekli değil)
git branch -M main

# Tüm değişiklikleri commit et
git add .
git commit -m "Initial commit to GitHub"

# GitHub'a push et
git push -u origin main
```

## 3. İlk Push Sonrası

İlk push'tan sonra GitHub kullanıcı adı ve şifrenizi isteyebilir. 
Eğer 2FA (İki Faktörlü Kimlik Doğrulama) aktifse, GitHub'da bir Personal Access Token oluşturmanız gerekebilir.

## 4. Personal Access Token (Gerekirse)

1. GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. "Generate new token" butonuna tıklayın
3. "repo" scope'unu seçin
4. Token'ı kopyalayın
5. Push sırasında şifre yerine bu token'ı kullanın

## Önemli Notlar

- `.env` dosyası artık `.gitignore`'da, bu yüzden GitHub'a yüklenmeyecek (güvenlik için önemli!)
- Tüm hassas bilgileri (private keys, API keys vb.) `.env` dosyasında tutun
- Repository'nizi public yaparsanız, kodunuz herkes tarafından görülebilir

