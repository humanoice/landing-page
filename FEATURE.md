# Upgrade application flow

## User Flow

1. User sign up in apply-form  --> send notification to Lark.
2. User select to be an invdividual or company client. 
- If an individual, user can optionally fill information for receipt: full name, address, ID number.
- If a company, user must fill information for receipt: company name, tax ID, address.
3. If company client, user will need to transfer only 97% because we need to deduct 3% for withholding tax.
4. User has to transfer the money to Kasikorn Bank 238-1-20282-0 name "บจก. ฮิวแมน น้อย". We will show the text. User will transfer on their own.
5. User upload the bank slip in the form
6. System call API to Deepseek to verify the bank slip 
7. If it fails, retry the API one more time.
8. Return the result
8.1 If the result is fake, tell users to contact us via LINE
8.2 If the result is true, go to 9.
9. Make the "paid_status" in "participants" table to be TRUE.
10. Send notification to Lark.
11. Show confirmation component (thank you + invite them to add LINE for updates). Send the calendar invite to the user's email and display.
The calendar invite will contain the location https://maps.app.goo.gl/cVHTdFiFeGcfsHdj7
and the details of the course.

## What to store on our database

- user information for receipt

## Technology
- We will use Deepseek API to verify the bank slip. We don't need high security because it's paying in advanced. If the user trick us, we won't let them in the class anyway. So it's not a big deal.
- We can use Resend service to send an email. I put my API key in .env as "RESEND_API_KEY"