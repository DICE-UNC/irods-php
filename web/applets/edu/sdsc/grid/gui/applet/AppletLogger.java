//      Copyright (c) 2005, Regents of the University of California
//      All rights reserved.
//
//      Redistribution and use in source and binary forms, with or without
//      modification, are permitted provided that the following conditions are
//      met:
//
//        * Redistributions of source code must retain the above copyright notice,
//      this list of conditions and the following disclaimer.
//        * Redistributions in binary form must reproduce the above copyright
//      notice, this list of conditions and the following disclaimer in the
//      documentation and/or other materials provided with the distribution.
//        * Neither the name of the University of California, San Diego (UCSD) nor
//      the names of its contributors may be used to endorse or promote products
//      derived from this software without specific prior written permission.
//
//      THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
//      IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
//      THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
//      PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
//      CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
//      EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
//      PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
//      PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//      LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//      NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
//      SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//
//  FILE
//      AppletLogger.java    -  edu.sdsc.grid.gui.applet.AppletLogger
//
//  CLASS HIERARCHY
//      java.lang.Object
//          |
//          +-.AppletLogger
//
//  PRINCIPAL AUTHOR
//      Alex Wu, SDSC/UCSD
//
//

package edu.sdsc.grid.gui.applet;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import java.util.Date;

import java.text.DateFormat;

// Class for logging debug messages to text file
class AppletLogger {
    static {
        init();
    }
    
    protected AppletLogger() {}
    private static AppletLogger instance = null;    
    
    public static AppletLogger getInstance() {
        if (instance == null)
            instance = new AppletLogger();
        
        return instance;
    }
            
    private static void init() {
        File file = new File(UploadApplet.IRODS_DIR);
        if (! file.exists())
            file.mkdir();
        
        file = new File(UploadApplet.APPLET_LOG);
        if (file.exists()) {
            // rename file and append current timestamp
            file.renameTo(new File(UploadApplet.APPLET_LOG + "-" + System.currentTimeMillis()));
        }
        
    }//init
    
    
    public synchronized static void log(String s) {
        
        File log = new File(UploadApplet.APPLET_LOG);            
        FileOutputStream fos = null;
        Date date = new Date();
        
        try {
            fos = new FileOutputStream(log, true);
            fos.write((date.toString() + "  ").getBytes());
            fos.write(s.getBytes());
            fos.write("\n".getBytes());
            
            // write to UploadApplet.textArea
            DateFormat df = DateFormat.getTimeInstance(DateFormat.SHORT);

        } catch (IOException ioe) {
            System.out.println("log(): " + ioe);
        } finally {
            try {
                fos.close();
            } catch (IOException ioe) {
                
            }
        }//try-catch-finally
        
    }//log
    
    
}//class