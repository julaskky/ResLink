<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Email verified | ResLink</title>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
            background: #f4f7fb;
            color: #172033;
            font-family: Arial, Helvetica, sans-serif;
        }
        main {
            width: 100%;
            max-width: 520px;
            padding: 42px 32px;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            background: #fff;
            text-align: center;
            box-shadow: 0 16px 50px rgba(15, 23, 42, .08);
        }
        .mark {
            display: inline-grid;
            place-items: center;
            width: 58px;
            height: 58px;
            border-radius: 18px;
            background: #e7f8ef;
            color: #087443;
            font-size: 28px;
            font-weight: 700;
        }
        h1 { margin: 22px 0 12px; font-size: 29px; }
        p { color: #64748b; line-height: 1.7; }
        a {
            display: inline-block;
            margin-top: 16px;
            padding: 13px 22px;
            border-radius: 10px;
            background: #123b70;
            color: #fff;
            text-decoration: none;
            font-weight: 700;
        }
        .brand { color: #123b70; font-size: 21px; font-weight: 800; }
    </style>
</head>
<body>
    <main>
        <div class="brand">ResLink</div>
        <div class="mark" aria-hidden="true">✓</div>
        <h1>Email verified successfully</h1>
        <p>
            Your email address has been verified. This confirms control of
            your email address; it does not automatically verify your
            institutional affiliation or research credentials.
        </p>
        <p>
            Your researcher profile remains subject to ResLink's
            verification process.
        </p>
        <a href="{{ $loginUrl }}">Continue to ResLink</a>
    </main>
</body>
</html>
