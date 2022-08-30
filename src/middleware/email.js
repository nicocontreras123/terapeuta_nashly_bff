const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const ical = require('ical-generator');
const moment = require("moment");


const readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            callback(err);
            throw err;
        }
        else {
            callback(null, html);
        }
    });
};

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'n.contrerasorellana@gmail.com',
        pass: 'aebvagditdioznxm'
    }
});

const getIcalObjectInstance = (starttime, endtime, summary, description, location, url , name ,email) => {
    const cal = ical({ domain: "mytestwebsite.com", name: 'My test calendar event' });
    cal.createEvent({
        start: starttime,         // eg : moment()
        end: endtime,             // eg : moment(1,'days')
        summary: summary,         // 'Summary of your event'
        description: description, // 'More description'
        location: location,       // 'Delhi'
        url: url,                 // 'event url'
        organizer: {              // 'organizer details'
            name: name,
            email: email
        },
    });
    return cal;
}

sendEmail = (req) => {
readHTMLFile('/Users/ncontreras/Desktop/Proyectos/terapeuta/terapeuta_nashly_bff/src/resources/templates/sessioncreate.html', function (err, html) {
    if(!err){
        const template = handlebars.compile(html);
        const htmlSend = template(req);

        const content = 'BEGIN:VCALENDAR\n' +
            'METHOD:REQUEST\n' +
            'PRODID:-//github.com/rianjs/ical.net//NONSGML ical.net 4.0//EN\n' +
            'VERSION:2.0\n' +
            'BEGIN:VEVENT\n' +
            'ATTENDEE;CN=NICOLÁS ANDRÉS CONTRERAS ORELLANA:mailto:n.contrerasorellana@g\n' +
            ' mail.com\n' +
            'DTEND;TZID=Chile/Continental:20220810T090000\n' +
            'DTSTAMP:20220808T171238Z\n' +
            'DTSTART;TZID=Chile/Continental:20220810T084500\n' +
            'GEO:-33.456931;-70.702743\n' +
            'LOCATION:Clínica RedSalud Santiago\n' +
            'ORGANIZER:mailto:nikoxxx571@gmail.com\n' +
            'SEQUENCE:0\n' +
            'SUMMARY:Cita de Terapia Ocupacional\n' +
            'UID:c4178a25-2f95-4070-b087-aeeb011b9f11\n' +
            'END:VEVENT\n' +
            'END:VCALENDAR\n'



        const email = {
            from: 'noreply@gmail.com',
            to: 'to.nashlypl@gmail.com',
            bcc: 'n.contrerasorellana@gmail.com',
            subject: 'Ha sido agendada una sesión',
            html: htmlSend,
            icalEvent: {
                filename: 'agend_invite.ics',
                method: 'PUBLISH',
                content: content
            }
        }
        return transporter.sendMail(email)
            .then((r) => {
                console.log('enviado ', r);
            }).catch(err => {
                console.log('error', err);
            })
    }else{
        console.log('error open', err);
    }
})

}

const email = {
    sendEmail: sendEmail,
}

module.exports = email;