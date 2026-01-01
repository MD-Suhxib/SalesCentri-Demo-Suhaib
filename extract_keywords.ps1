$word = New-Object -ComObject Word.Application
$doc = $word.Documents.Open("c:\Users\moham\Downloads\Sales Centri Keywords Research-1.docx")
$text = $doc.Content.Text
$text | Out-File -FilePath keywords.txt
$doc.Close()
$word.Quit()