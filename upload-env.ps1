Get-Content .env | ForEach-Object {
  $line = $_
  if ($line -match '^([^=]+)=(.*)$') {
    $name = $matches[1]
    $value = $matches[2]
    gh secret set $name --body $value --repo mjavason/startup
  }
}
