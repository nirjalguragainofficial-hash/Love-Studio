git add -A
git commit -m "Move files to Love Studio directory"

for ($i=2; $i -le 10; $i++) {
    $date = Get-Date
    "Commit $i at $date" | Out-File -Append -FilePath "dummy_commits.txt"
    git add dummy_commits.txt
    git commit -m "Commit number $i"
}

git push origin main
