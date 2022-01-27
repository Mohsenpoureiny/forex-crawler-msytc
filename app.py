from datetime import timedelta
from flask import Flask, render_template, request, make_response, session, redirect, url_for
from flask_socketio import SocketIO, join_room, leave_room
import os
from flask_wtf import FlaskForm , RecaptchaField
from wtforms import (StringField,SubmitField,
                         DateTimeField, RadioField,
                         SelectField,TextAreaField, DateField)
from wtforms.validators import DataRequired
import json
import time
import sqlite3
import hashlib
import uuid
import random

app = Flask(__name__)
app.config["SECRET_KEY"] = str(uuid.uuid4())
app.config['RECAPTCHA_USE_SSL']= False
app.config["RECAPTCHA_PUBLIC_KEY"]="6Ldt-2saAAAAAAy8zE4-7WdNX-c4TJX7EjLvGyFq"
app.config["RECAPTCHA_PRIVATE_KEY"]="6Ldt-2saAAAAAO7iOOMEcsvLTvqYAnpThY_51sdj"
socketio = SocketIO(app,cors_allowed_origins="*")
class Widgets(FlaskForm):
    recaptcha = RecaptchaField()


def rjson():
    return json.loads(open("json/message.json", 'r').read())['message']
def get_room(username):
    return get_1(username, "admins", "userhex")
def get_admin(username):
    return get_1(username, "users", "admin")
def notclosedpositions(username):
    con = sqlite3.connect(json.loads(
            open("json/database.json", 'r').read())['databasename'])
    return con.execute(f"select Title,Type,Value,Code from {username} where Status!='Closed';").fetchall()
def get_1(username, table, cl):
    try:
        con = sqlite3.connect(json.loads(
            open("json/database.json", 'r').read())['databasename'])
        return con.execute(f"select {cl} from {table} where username='{username}';").fetchall()
    except:
        return "False"
def getTpSlOrdersDatbase(username):
    try:
        con = sqlite3.connect(json.loads(
            open("json/database.json", 'r').read())['databasename'])
        x = con.execute(f"SELECT * FROM {username};").fetchall()
        ls = []
        for i in x:
            if "success" in i[4]:
                if i[8]=="1":
                    ls.append(i[4].split("-")[2])
        return ls
    except Exception as e:
        print(str(e))
        return "False"
def select50row(username):
    try:
        con = sqlite3.connect(json.loads(
            open("json/database.json", 'r').read())['databasename'])
        x = con.execute(f"SELECT * FROM {username};").fetchall()
        return x[len(x)-101:len(x)]
    except Exception as e:
        print(str(e))
        return "False"
def get_code(username,code):
    try:
        con = sqlite3.connect(json.loads(
            open("json/database.json", 'r').read())['databasename'])
        return con.execute(f"select Status from {username} where Code='{code}';").fetchall()[0][0].split("-")[2]
    except Exception as e:
        return "False" + str(e)
def update_1_order(username, code, stasus,price,i):
    try:
        code1= ''
        if type(code) == type([]):
            code1=code[0][0]
        elif type(code) == type((1,2)):
            code1=code[0][0]
        elif type(code) == type(""):
            code1=code
        con = sqlite3.connect(json.loads(
            open("json/database.json", 'r').read())['databasename'])
        ex = f"update {username} set Status = '{stasus}' where Code= '{code}';"
        if i==1:
            ex2 = f"update {username} set OpenPrice = '{price}' where Code= '{code}';"
            con.execute(ex2)
        elif i==2:
            ex2 = f"update {username} set ClosePrice = '{price}' where Code= '{code}';"
            con.execute(ex2)
        elif i==3:
            pass
        con.execute(ex)
        con.commit()
        return True
    except Exception as e:
        print(str(e))
        return False
def update_1(username, table, cl, to):
    try:
        con = sqlite3.connect(json.loads(
            open("json/database.json", 'r').read())['databasename'])
        con.execute(
            f"update {table} set {cl} = '{to}' where username='{username}';")
        con.commit()
        return True
    except:
        return False
def get_cl(clName, tableName):
    con = sqlite3.connect(json.loads(
        open("json/database.json", 'r').read())['databasename'])
    return con.execute(f"select {clName} from {tableName};").fetchall()
def create_admin(name, username, password):
    con = sqlite3.connect(json.loads(
        open("json/database.json", 'r').read())['databasename'])
    userhex = str(uuid.uuid4())
    pic = random.randint(1, 10)
    password = hashlib.md5(password.encode()).hexdigest()
    con.execute(
        f"INSERT INTO admins values ('{userhex}','{username}','{name}','{password}','@',1000,'EURUSD, Euro vs US Dollar@GBPUSD, Pound Sterling vs US Dollar@USDCHF, US Dollar vs Swiss Franc@',{pic});")
    con.execute(f"""CREATE TABLE IF NOT EXISTS {username}(
        Type TEXT,
        Code TEXT,
        User TEXT,
        Title TEXT,
        Value TEXT,
        Status TEXT,
        Time TEXT,
        tp TEXT,
        sl TEXT,
        e TEXT
        ); """)
    con.commit()
def order_inAdmin(username, Otype, code, users, title, value, time,tp,sl):
    e = 1
    if float(tp)==0.0 and float(sl)==0.0:
        e = 0
    con = sqlite3.connect(json.loads(
        open("json/database.json", 'r').read())['databasename'])
    con.execute(
        f"INSERT INTO {username} values ('{Otype}','{code}','{users}','{title}','{value}','sended','{time}','{tp}','{sl}','{e}');")
    con.commit()
def order_inuser(username,title, value, Otype, code, time,tp,sl,mt):
    e = 1
    if float(tp)==0.0 and float(sl)==0.0:
        e = 0
    con = sqlite3.connect(json.loads(
        open("json/database.json", 'r').read())['databasename'])
    con.execute(
        f"INSERT INTO {username} values ('{Otype}','{code}','{title}','{value}','--','--','Get','{time}','{tp}','{sl}','{e}','{mt}');")
    con.commit()
def create_user(name, username, password):
    con = sqlite3.connect(json.loads(
        open("json/database.json", 'r').read())['databasename'])
    userhex = str(uuid.uuid4())
    pic = random.randint(1, 10)
    password = hashlib.md5(password.encode()).hexdigest()
    con.execute(
        f"INSERT INTO users values ('{userhex}','{username}','{name}','{password}','NoAdmin',{pic},'{gregorian_to_jalali()}');")
    con.execute(f"""CREATE TABLE IF NOT EXISTS {username}(
        Type TEXT,
        Code TEXT,
        Title TEXT,
        Value TEXT,
        OpenPrice TEXT,
        ClosePrice TEXT,
        Status TEXT,
        Time TEXT,
        tp TEXT,
        sl TEXT,
        e TEXT,
        Metatrader TEXT
        ); """)
    con.commit()
def getanAnOrderStatus(username,code):
    con = sqlite3.connect(json.loads(
        open("json/database.json", 'r').read())['databasename'])
    if len(con.execute(f"select Status from {username} where Code='{code}';").fetchall())>0:
        return con.execute(f"select Status from {username} where Code='{code}';").fetchall()[0][0]
    else:
        return "NotFounds"
def getanOrderusres(username,code):
    con = sqlite3.connect(json.loads(
        open("json/database.json", 'r').read())['databasename'])
    ls = con.execute(f"select User from {username} where Code='{code}';").fetchall()[0][0].split("@")
    lsd = []
    lsd2 = []
    for t in ls:
        if t!='':
            if "success" in getanAnOrderStatus(t,code):
                lsd.append(t)
                lsd2.append(getanAnOrderStatus(t,code))
    return lsd , lsd2
def check_user_name(username):
    try:
        username = username.lower()
        con = sqlite3.connect(json.loads(
            open("json/database.json", 'r').read())['databasename'])
        tp = con.execute(
            f"select username from users where username='{username}';").fetchall()
        b = False
        for i in tp:
            try:
                if username == i[0]:
                    return True, "User"
            except:
                break
        con = sqlite3.connect(json.loads(
            open("json/database.json", 'r').read())['databasename'])
        tp = con.execute(
            f"select username from admins where username='{username}';").fetchall()
        for i in tp:
            try:
                if username == i[0]:
                    return True, "Admin"
            except:
                break
        if b == False:
            return False, "--"
    except Exception as e:
        return True, "--"
def check_password(username, password):
    try:
        username = username.lower()
        password = hashlib.md5(password.encode()).hexdigest()
        con = sqlite3.connect(json.loads(
            open("json/database.json", 'r').read())['databasename'])
        tp = con.execute(
            f"select password from users where username='{username}';").fetchall()
        b = False
        for i in tp:
            print(type(i))
            try:
                if password == i[0]:
                    return True
            except:
                break
        con = sqlite3.connect(json.loads(
            open("json/database.json", 'r').read())['databasename'])
        tp = con.execute(
            f"select password from admins where username='{username}';").fetchall()
        for i in tp:
            try:
                if password == i[0]:
                    return True
            except:
                break
        if b == False:
            return False
    except Exception as e:
        return True, "--"
    except Exception as e:
        return True, "--"
def firstDatabase(databasename):
    try:
        con = sqlite3.connect(databasename)
        con.execute("""CREATE TABLE IF NOT EXISTS users(
        userhex TEXT,
        username INT,
        name TEXT,
        password TEXT,
        admin TEXT,
        pic INT,
        sing_date TEXT); """)
        con.execute("""create table admins(
        userhex TEXT,
        username INT,
        name TEXT,
        password TEXT,
        users TEXT,
        OrderNumber INT,
        titles TEXT,
        pic INT); """)
        con.commit()
        return True
    except Exception as e:
        return False
def get_time():
    t = time.localtime()
    current_time = time.strftime("%D/%H/%M/%S", t)
    ti = current_time.split('/')
    return ti[3]+':'+ti[4]
def gregorian_to_jalali():
    t = time.localtime()
    current_time = time.strftime("%D/%H/%M/%S", t)
    ti = current_time.split('/')
    gy = int("20"+ti[2])
    gm = int(ti[0])
    gd = int(ti[1])
    g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
    if (gm > 2):
        gy2 = gy + 1
    else:
        gy2 = gy
    days = 355666 + (365 * gy) + ((gy2 + 3) // 4) - ((gy2 + 99) //
                                                     100) + ((gy2 + 399) // 400) + gd + g_d_m[gm - 1]
    jy = -1595 + (33 * (days // 12053))
    days %= 12053
    jy += 4 * (days // 1461)
    days %= 1461
    if (days > 365):
        jy += (days - 1) // 365
        days = (days - 1) % 365
    if (days < 186):
        jm = 1 + (days // 31)
        jd = 1 + (days % 31)
    else:
        jm = 7 + ((days - 186) // 30)
        jd = 1 + ((days - 186) % 30)
    return str(jy)+'/' + str(jm) + '/'+str(jd) + "  " + ti[3]+':'+ti[4]+':'+ti[5]
def check_database():
    if json.loads(open("json/database.json", 'r').read())['databasename'] == '--':
        return False
    else:
        return True
def get_userData(username):
    try:
        username = username.lower()
        con = sqlite3.connect(json.loads(
            open("json/database.json", 'r').read())['databasename'])
        tp = con.execute(
            f"select name,admin,sing_date from users where username='{username}';").fetchall()
        return tp[0][0], tp[0][1], tp[0][2]
    except Exception as e:
        return True, "--"
def get_adminData(username):
    try:
        username = username.lower()
        con = sqlite3.connect(json.loads(
            open("json/database.json", 'r').read())['databasename'])
        tp = con.execute(
            f"select name,users,OrderNumber from admins where username='{username}';").fetchall()
        return tp[0][0], tp[0][1], tp[0][2]
    except Exception as e:
        return True, "--"

@app.route("/")
def Home():
        if check_database() == False:
            return render_template("frist_start.html")
        else:
            try:
                print(request.headers)
                if session["username"]:
                    print(session["username"],session["smt"])
                    if session["smt"] == "Admin":
                        bl, smt = check_user_name(session["username"])
                        if bl and smt == session["smt"]:
                            name, users, OrderNumber = get_adminData(
                                session["username"])
                            pic = get_1(session["username"], "admins", "pic")[0][0]
                            return render_template("AdminPage.html", name=name, username=session["username"], pic=pic)
                    elif session["smt"] == "User":
                        bl, smt = check_user_name(session["username"])
                        if bl and smt == session["smt"]:
                            name, admin, sing_date = get_userData(
                                session["username"])
                            pic = get_1(session["username"], "users", "pic")[0][0]
                            cdv = "undefined browser! \n Use newer versions of Chrome browser "
                            try:
                                txc = request.headers["Sec-Ch-Ua"]
                                if "Chrome" in txc:
                                    if 'v="89"' in txc:
                                        cdv = "89"
                                    if 'v="88"' in txc:
                                        cdv = "88"
                                    if 'v="87"' in txc:
                                        cdv = "87"
                                    if 'v="86"' in txc:
                                        cdv = "86"
                            except:
                                cdv = "احتمال میدهیم شما از مروگر خزنده وارد سایت شده اید \n "
                            return render_template("UserPage.html", name=name, username=session["username"], pic=pic,Admin=admin,cdv=cdv)
                else:
                    form = Widgets()
                    return render_template("auth.html", form=form)
            except Exception as e:
                print(str(e))
                form = Widgets()
                return render_template("auth.html", form=form)
@app.route("/firstRun/config", methods=["POST"])
def firstRun_config():
    secret_key = request.form.get("secret_key", "NotFound")
    databasename = request.form.get("databasename", "NotFound") + ".db"
    platform_version = request.form.get("platform_version", "NotFound")
    if check_database() == False and databasename != "NotFound":
        try:
            dic = json.loads(open("json/database.json", 'r').read())
            if firstDatabase(databasename):
                dic["databasename"] = databasename
                open("json/database.json", 'w+').write(json.dumps(dic))
                return "200"
            else:
                return "مشکلی پیش آمده - لطفا در ارائه درخواست دقت کنید" + "dd"
        except Exception as e:
            return "خطا در بر قراری ارتباط با پایگاه داده" + str(e)
    else:
        return "مشکلی پیش آمده - لطفا در ارائه درخواست دقت کنید"
@app.route("/checkusername")
def check_username():
    username = request.args.get("username").lower()
    alph = "abcdefghijklmnopqrstuvwxyz"
    ns = "0123456789"
    b = True
    for i in username[1:]:
        if i in alph or i in ns:
            pass
        else:
            b = False
    if len(username) < 8:
        return "incorrect Username"
    else:
        bl, smt = check_user_name(username)
        if bl:
            return "incorrect Username"
        elif username[0] in alph and b:
            return "200"
        else:
            return "incorrect Username"
@app.route("/Signin/config")
def Signin_config():
    name = request.args.get("name", "Notfound")
    username = request.args.get("username", "Notfound").lower()
    password = request.args.get("password", "Notfound")
    accType = request.args.get("accType", "Notfound")
    bl, smt = check_user_name(username)
    if accType == "user" and bl == False:
        try:
            create_user(name, username, password)
            return "200"
        except Exception as e:
            return "incorrect Username" + str(e)
    elif accType == "admin" and bl == False:
        try:
            create_admin(name, username, password)
            return "200"
        except Exception as e:
            print(str(e))
            return "incorrect Username"
    else:
        print(accType)
        return "incorrect Username"
@app.route("/login/submit", methods=["POST"])
def login_config():
    username = request.form.get("username", "Notfound")
    password = request.form.get("password", "Notfound")
    blUsername, smt = check_user_name(username)
    blPassword = check_password(username, password)
    print(blPassword)
    print(blUsername)
    print(smt)
    if blUsername and blPassword:
        if smt == "Admin" or smt == "User":
            session["username"] = username.lower()
            session['smt'] = smt
            print(session["username"],session['smt'])
            return redirect(url_for("Home"))
        else:
            return "Error"
    else:
        session.clear()
        return render_template("ErrorLogin.html")
@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("Home"))
@app.route('/history')
def history():
    try:
        username = session["username"]
        row50 = select50row(username)
        users = []
        if session["smt"] =="Admin":
            name, users2, OrderNumber = get_adminData(username)
            i = users2.split("@")
            for w in i:
                if w!="":
                    users.append(w)
        return render_template("history.html",username=username,rows=row50,smt=session["smt"],users=users)
    except Exception as e:
        print(str(e))
        return redirect(url_for("error"))
@app.route('/admin/history')
def adminhistory():
        if session["username"]:
            if session["smt"]:
                if session["smt"]=="Admin":
                    row50 = select50row(request.args["username"])
                    rt = []
                    for i in row50:
                        d = []
                        for u in i:
                            d.append(u)
                        rt.append(d)
                    return {"data":rt}
        return "incorrect response"

@app.route("/followUsers")
def followUsers():
    if session["username"] and session['smt']:
        username = session["username"]
        smt = session['smt']
        if smt == "Admin":
            usernames = get_cl("username", "users")
            names = get_cl("name", "users")
            dates = get_cl("sing_date", "users")
            name, users, OrderNumber = get_adminData(username)
            usersLS = []
            if users != "@":
                usersLS = users.split('@')
                for i in usersLS:
                    if i == "":
                        del usersLS[usersLS.index(i)]
            usersHasAdmin = []
            for i in usernames:
                admin = get_admin(i[0])[0][0]
                if admin != "NoAdmin":
                    usersHasAdmin.append(i)
            print(usersHasAdmin)
            return render_template("followUsers.html", username=username, names=names, usernames=usernames, Myusers=usersLS, name=name, dates=dates, usersHasAdmin=usersHasAdmin)
@app.route("/Admin/settings")
def Adminsettings():
  if session["username"] and session['smt']:
        username = session["username"]
        smt = session['smt']
        if smt == "Admin":
            names = get_cl("name", "users")
            return render_template("AdminSettings.html", username=username, names=names)
@app.route("/Admin/settings/config")
def Adminsettingsconf():
  if session["username"] and session['smt']:
        username = session["username"]
        smt = session['smt']
        if smt == "Admin":
            smbl=request.args["smbl"]
            rt = get_1(username, "admins", "titles")[0][0]
            update_1(username, "admins", "titles", rt+"@"+smbl)
            return render_template("successful.html")
@app.route("/Admin/EnterSharedArea")
def Admin_EnterSharedArea():
    try:
        if request.headers["Sec-Ch-Ua-Mobile"] == "?0":
            if session["username"] and session['smt']:
                username = session["username"]
                smt = session['smt']
                if smt == "Admin":
                    name, users, OrderNumber = get_adminData(username)
                    if users != "@":
                        usersLS = users.split('@')
                        for i in usersLS:
                            if i == "":
                                del usersLS[usersLS.index(i)]
                        UsersName = []
                        for i in usersLS:
                            name = get_userData(i)
                            UsersName.append(name)
                        randomn = random.random()
                        room = get_room(username)[0][0]
                        pic = get_1(session["username"], "admins", "pic")[0][0]
                        notclosed = notclosedpositions(username)
                        titles = get_1(username,"admins","titles")[0][0].split("@")
                        if len(notclosed)>0:
                            notclosed.reverse()
                        return render_template("trade_page.html", name=name, users=usersLS, username=username, UsersName=UsersName, random=randomn, pic=pic, room=room,notclosed=notclosed,titles=titles)
                    else:
                        pic = get_1(session["username"], "admins", "pic")[0][0]
                        room = get_room(username)
                        return render_template("trade_page.html", name=name, username=username, pic=pic, room=room)
                else:
                    return redirect(url_for("error"))
            else:
                return redirect(url_for("error"))
        else:
            return render_template("Mobile.html")
    except:
            return redirect(url_for("Home"))
@app.route("/follow")
def follow():
    username = request.args.get("username", 'Notfound')
    try:
        i1 = True
        i2 = True
        name, admin, sing_date = get_userData(username)
        if admin == "NoAdmin" and session["username"]:
            us = get_1(session["username"], "admins", "users")
            i1 = update_1(username, "users", "admin", session["username"])
            i2 = update_1(session["username"], "admins",
                          "users", us[0][0] + "@" + username)
            if i1 and i2:
                return render_template("successful.html")
            else:
                return redirect(url_for("error"))
        else:
            return redirect(url_for("error"))
    except Exception as e:
        print(str(e))
        return redirect(url_for("error"))
@app.route("/get/code")
def getcode():
    if session["username"]:
        if session["smt"]:
            if session["smt"] == "Admin":
                code = str(get_1(session["username"],
                                 "admins", "OrderNumber")[0][0])
                update_1(session["username"], "admins",
                         "OrderNumber", str(int(code)+1))
                return code
            else:
                return "error"
        return "error"
    return "error"
@app.route("/send/GetedOrder")
def sendGetedOrder():
    if session["username"]:
        title = request.args['title']
        value = request.args['value']
        Ordertype = request.args['Ordertype']
        code = request.args['code']
        tp = request.args['tp']
        sl = request.args['sl']
        mt = request.args['mt']
        time =gregorian_to_jalali()
        username = session["username"]
        order_inuser(username,title, value, Ordertype, code, time,tp,sl,mt)
        return "Seccess"
    else:
        return "error"
@app.route("/user/CodeTomqlCode")
def CodeTomqlCode():
    if session["username"]:
        if session["smt"]:
            if session["smt"] == 'User':
                code = request.args['code']
                return get_code(session["username"],code)
@app.route("/user/EnterSharedArea")
def userEnterSharedArea():
        try:
            if session["username"]:
                if session["smt"]:
                    if session["smt"] == 'User':
                        admin = get_admin(session["username"])[0][0]
                        room = get_room(admin)[0][0]
                        randomn = random.random()
                        pic = get_1(session["username"], "users", "pic")[0][0]
                        return render_template("UserSharedArea.html", username=session["username"], random=randomn, pic=pic, room=room)
                    else:
                        return redirect(url_for("error"))
                else:
                    return redirect(url_for("error"))
            else:
                return redirect(url_for("error"))
        except:
            return redirect(url_for("Home"))
@app.route("/admin/order/users")
def adminorderusers():
    if session["username"]:
        if session["smt"]:
            if session["smt"] == 'Admin':
                username=session["username"]
                code=request.args["code"]
                users , statuses = getanOrderusres(username,code)
                return {"users":users,"prices":statuses}
@app.route("/get/TpSlOrders")
def getTpSlOrders():
    if session["username"]:
        if session["smt"]:
            if session["smt"] == 'User':
                data = []
                data = getTpSlOrdersDatbase(session["username"])
                return {"data":data}
    return "Error"
@socketio.on('Message')
def handle_message(json, methods=['GET', 'POST']):
    json["time"] = get_time()
    if json["type"] == "Order":
        json["time"] =gregorian_to_jalali()
        order_inAdmin(json["username"], json["Ordertype"], json["code"],
                      json["ids"], json["title"], json["value"], json["time"], json["tp"], json["sl"])
    if json["type"] == "success":
        json["time"] =gregorian_to_jalali()
        update_1_order(json["user_name"], json["code"], f"success - Price : {json['price']}-{json['mqlCode']}",json['price'],1)
    if json["type"] == "lossed":
        json["time"] =gregorian_to_jalali()
        update_1_order(json["user_name"], json["code"], "lossed","--",1)
    if json["type"] == "close":
        json["time"] =gregorian_to_jalali()
        update_1_order(json["username"], json["code"][0], "Closed","--",3)
    if json["type"] == "closed":
        update_1_order(json["username"], json["code"], "Closed",json["price"],2)
    if json["type"] == "autoClosed":
        update_1_order(json["username"], json["code"], "Auto Closed","TP-SL",2)
    room = json["room"]
    socketio.emit('Message', json, room=room)
@socketio.on('join')
def join(json, methods=['GET', 'POST']):
    try:
        join_room(json['room'])
        socketio.emit('Message', {"time": get_time(), "pic": json["pic"],
                                  'user_name': json['username'], 'type': "normal", 'message': f"{json['username']} is join!"}, room=json['room'])
    except:
        pass
@socketio.on('leave')
def leave(json, methods=['GET', 'POST']):
    try:
        leave_room(json['room'])
        socketio.emit('Message', {"time": get_time(), "pic": json["pic"],
                                  'user_name': json['username'], 'type': "normal", 'message': f"{json['username']} leave !"}, room=json['room'])
    except:
        pass
@app.errorhandler(404)
def error0(e):
    return render_template("404.html"), 404
@app.route('/error/404')
def error():
    return render_template("404.html")
@app.errorhandler(403)
def forbidden(e):
  return { 'message': 'forbidden' }
if __name__=="__main__":
    socketio.run(app)